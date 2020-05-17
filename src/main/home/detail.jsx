import React from "react";
import {
    Button,
    DatePicker,
    Icon,
    ImagePicker,
    InputItem,
    List, Modal,
    NavBar,
    Toast,
    WhiteSpace,
    WingBlank
} from "antd-mobile";
import {defaultCarInfo, defaultTransaction, defaultUser} from "../../util/dict";
import {mask} from "../../components/BasicInfo";
import {millSecondsToDays, randOrderId} from "../../util/commonUtil";
import http from "../../util/http";
import {auth} from "../../util/auth";

/**
 * key转value
 * @type {{"0": string, "1": string}}
 */
const transmissionCaseKeyToValue = {
    0 : "自动",
    1 : "手动"
};

/**
 * key转value
 * @type {{"0": string, "1": string}}
 */
const inletKeyToValue = {
    0 : "自然进气",
    1 : "涡轮增压"
}

/**
 * key转value
 * @type {{"0": string, "1": string}}
 */
const parkingSensorKeyToValue = {
    0 : "有",
    1 : "无"
}

/**
 * 车辆详细信息界面
 */
export default class Detail extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            carInfo: defaultCarInfo, //车辆信息
            transaction: defaultTransaction, //交易信息
            user: defaultUser, //用户信息
            pictures: [], //照片
        }
    }

    componentDidMount() {
        const params = this.props.history.location.state;
        // 从路由参数中获取数据
        if(params)
            this.setState({
                carInfo: params.carInfo,
                user: auth.getUser()
            }, () => this.initPictures());
    }

    /**
     * 初始化车辆照片
     * @returns {Promise<void>}
     */
    initPictures = () => {
        const {pictures, carInfo} = this.state;
        pictures.push({url: carInfo.url});
        this.setState({pictures});
    }

    /**
     * 修改值的公共方法
     * @param key
     * @param value
     */
    modifyValue = (key, value) => {
        const newValue = {
            [key]: value
        };
        this.setState({transaction: {...this.state.transaction, ...newValue}}, () => this.calculate());
    };

    /**
     * 根据开始时间和结束时间计算天数和费用
     */
    calculate = () => {
        const {transaction, carInfo} = this.state;
        if(transaction.begin !== 0 && transaction.end !== 0){
            if(transaction.end <= transaction.begin){
                Toast.info("租赁结束时间不能早于租赁开始时间");
                this.setState({transaction: {...this.state.transaction, end: 0}});
            }else{
                this.setState({
                    transaction: {
                        ...this.state.transaction,
                        rentDays: millSecondsToDays(transaction.end - transaction.begin),
                        totalFee: millSecondsToDays(transaction.end - transaction.begin) * carInfo.rentFee
                    }
                })
            }
        }
    }

    /**
     * 提交订单
     */
    submit = async () => {
        const {carInfo,transaction, user} = this.state;
        try {
            // 需要先进行实名认证
            if(user.isCert){
                Toast.loading("正在提交订单中...",0);
                // 交易信息
                const temp = {
                    ...transaction,
                    orderId: randOrderId(),
                    carId: carInfo.id,
                    carName: carInfo.name,
                    userPhone: user.phone,
                    time: Date.now()
                }
                const resp = await http.sendTransactionByAdd("transaction:"+temp.orderId, temp);
                Toast.hide();
                if(resp.data && resp.data.error){
                    // 失败
                    const state = {
                        type: 0
                    };
                    this.props.history.replace({pathname: "/main/transaction/result",state})
                }else{
                    Modal.alert("提醒","订单提交成功，是否进行支付",[
                        {text: "取消", onPress:() => {
                                // 订单状态为待付款
                                const state = {
                                    type: 1
                                };
                                this.props.history.replace({pathname: "/main/transaction/result",state})
                            }},
                        {text: "确认", onPress:async () => {
                            // 订单状态为付款成功
                            temp.isPaid = true;
                            const resp = await http.sendTransactionByAdd("transaction:"+temp.orderId, temp);
                            if(resp.data){
                                const state = {
                                    type: 2
                                };
                                this.props.history.replace({pathname: "/main/transaction/result",state})
                            }
                        }}
                    ]);
                }
            }else{
                Modal.alert("提醒","您尚未进行实名认证，需要实名认证完成后才能执行该操作，是否前往实名认证？",[
                    {text: "确认", onPress:() => this.props.history.push("/main/mine/cert")}
                ]);
            }

        }catch (e) {
            console.log(e);
        }
    }

    render(){
        const {carInfo, pictures, transaction} = this.state;
        return(
            <div className="start">
                {/*导航栏*/}
                <NavBar
                    style={{
                        width: '100%',
                        position: 'fixed',
                        zIndex: 1
                    }}
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    租赁车辆详情
                </NavBar>
                <WhiteSpace size={"xl"}/>
                <WhiteSpace size={"xl"}/>
                {/*车辆基本信息*/}
                <List renderHeader={() => <div>车辆基本信息</div>}>
                    <InputItem
                        type={"text"}
                        disabled={true}
                        maxLength={20}
                        value={carInfo.name}
                    >
                        车辆名称：
                    </InputItem>
                    <InputItem
                        type={"text"}
                        disabled={true}
                        value={carInfo.brand}
                    >
                        车辆品牌：
                    </InputItem>
                    <List.Item>
                        <div>车辆图片：</div>
                        <WhiteSpace size={"sm"}/>
                        <WingBlank>
                            <ImagePicker
                                files={pictures}
                                length={3}
                                selectable={pictures.length < 1}
                            />
                            <WhiteSpace size={"sm"}/>
                        </WingBlank>
                    </List.Item>
                    <InputItem
                        type={"text"}
                        disabled={true}
                        value={transmissionCaseKeyToValue[carInfo.transmissionCase]}
                    >
                        变速箱类型：
                    </InputItem>
                    <InputItem
                        type={"number"}
                        disabled={true}
                        value={carInfo.tankCapacity.toString()}
                        extra="L"
                    >
                        油箱容量：
                    </InputItem>
                    <InputItem
                        type={"money"}
                        disabled={true}
                        value={carInfo.displacement.toString()}
                        extra="L"
                    >
                        排量：
                    </InputItem>
                    <InputItem
                        type={"money"}
                        disabled={true}
                        value={carInfo.consumption.toString()}
                        extra="L/100km"
                    >
                        百公里消耗：
                    </InputItem>
                    <InputItem
                        type={"number"}
                        disabled={true}
                        value={carInfo.seats.toString()}
                        extra="位"
                    >
                        座位数：
                    </InputItem>
                    <InputItem
                        type={"text"}
                        disabled={true}
                        value={inletKeyToValue[carInfo.inlet]}
                    >
                        进气：
                    </InputItem>
                    <InputItem
                        type={"text"}
                        disabled={true}
                        value={parkingSensorKeyToValue[carInfo.parkingSensor]}
                    >
                        倒车雷达：
                    </InputItem>
                    <InputItem
                        type={"number"}
                        disabled={true}
                        value={carInfo.rentFee.toString()}
                        extra="元"
                    >
                        日租车费用：
                    </InputItem>
                </List>
                {/*租赁信息*/}
                <List renderHeader={() => <div>租赁信息</div>}>
                </List>
                <DatePicker
                    value={new Date(Number(transaction.begin))}
                    mode={"date"}
                    minDate={new Date()}
                    onChange={date => this.modifyValue("begin", date.valueOf())}
                >
                    <List.Item
                        arrow={"horizontal"}
                    >
                        租赁开始时间{mask}：
                    </List.Item>
                </DatePicker>
                <DatePicker
                    value={new Date(Number(transaction.end))}
                    mode={"date"}
                    minDate={new Date()}
                    onChange={date => this.modifyValue("end", date.valueOf())}
                >
                    <List.Item
                        arrow={"horizontal"}
                    >
                        租赁结束时间{mask}：
                    </List.Item>
                </DatePicker>
                <InputItem
                    type={"number"}
                    disabled={true}
                    value={transaction.rentDays.toString()}
                    extra="天"
                >
                    租赁天数{mask}：
                </InputItem>
                <InputItem
                    type={"number"}
                    disabled={true}
                    value={transaction.totalFee.toString()}
                    extra="元"
                >
                    租赁总费用{mask}：
                </InputItem>
                <WhiteSpace size={"xl"}/>
                <WingBlank>
                    <Button
                        type={"primary"}
                        size={"small"}
                        disabled={transaction.rentDays === 0}
                        onClick={() => this.submit()}
                    >
                        提交
                    </Button>
                </WingBlank>
                <WhiteSpace size={"xl"}/>
            </div>
        )
    }
}