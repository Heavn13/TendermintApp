import React from "react";
import {
    Button,
    DatePicker,
    Icon,
    ImagePicker,
    InputItem,
    List,
    NavBar,
    Toast,
    WhiteSpace,
    WingBlank
} from "antd-mobile";
import {defaultCarInfo, defaultTransaction, defaultUser} from "../../util/dict";
import {jsonToDouble, jsonToSingle, timeStampToDateTime} from "../../util/commonUtil";
import http from "../../util/http";
import {auth} from "../../util/auth";
import {decodeBase64} from "../../util/decode";
import {ipfs} from "../../util/ipfs";
import gpsData from "../../assets/GPS.json";
// 百度地图html界面，建议以后进行分离
const map = `<!DOCTYPE html><html><head><meta http-equiv="Content-Type"content="text/html; charset=utf-8"/><meta name="viewport"content="initial-scale=1.0, user-scalable=no"/><style type="text/css">body,html,#allmap{width:100%;height:100%;overflow:hidden;margin:0;font-family:"微软雅黑"}</style><script type="text/javascript"src="//api.map.baidu.com/api?v=2.0&ak=eG3yfD2DYtzzA6LpFoCU05yV49S0U0bo"></script><title>折线上添加方向箭头</title></head><body><div id="allmap"></div></body></html><script type="text/javascript">var map=new BMap.Map("allmap");map.centerAndZoom(new BMap.Point(120.325,36.068),15);map.enableScrollWheelZoom(true);var sy=new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW,{scale:0.6,strokeColor:'#fff',strokeWeight:'2',});var icons=new BMap.IconSequence(sy,'10','30');var pois=[new BMap.Point(120.32036324162871,36.07146606146941),new BMap.Point(120.325370209771,36.07165055196446),new BMap.Point(120.32550194494078,36.06807995840011),new BMap.Point(120.32635714453329,36.06840751561125),new BMap.Point(120.33465269679829,36.066941499391056)];var polyline=new BMap.Polyline(pois,{enableEditing:false,enableClicking:true,icons:[icons],strokeWeight:'8',strokeOpacity:0.8,strokeColor:"#18a45b"});map.addOverlay(polyline);</script>`

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
 * key转value
 * @type {{"0": string, "1": string}}
 */
const typeKeyToValue = {
    0 : "待付款",
    1 : "进行中",
    2 : "已完成"
}

/**
 * 交易详细信息界面
 */
export default class TransactionDetail extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            type: 0, //交易状态
            transaction: defaultTransaction, //交易信息
            user: defaultUser, //用户信息
            pictures: [], //照片
            carInfo: defaultCarInfo, //车辆信息
            hidden: true //百度地图是否隐藏
        }
    }

    componentDidMount() {
        const params = this.props.history.location.state;
        // 从路由参数中获取数据
        if(params)
            this.setState({
                type: params.type,
                transaction: params.transaction,
                user: auth.getUser()
            }, () => this.init());
    }

    /**
     * 初始化车辆信息
     */
    init = async () => {
        const {transaction} = this.state;
        try {
            const resp = await http.query("","car:"+transaction.carId);
            if(resp.data && resp.data.result.response.value){
                const carInfo = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                console.log(carInfo)
                this.setState({carInfo}, () => this.initPictures());

            }
        }catch (e) {
            console.log(e);
        }
    }

    /**
     * 初始化车辆照片
     */
    initPictures = async () => {
        const {pictures, carInfo} = this.state;
        try {
            const result = await ipfs.get(carInfo.picture);
            pictures.push({url: result});
            this.setState({pictures});
        }catch (e) {
            console.log(e);
        }
    }

    /**
     * 支付订单
     */
    pay = async () => {
        const {transaction} = this.state;
        try {
            Toast.loading("正在支付订单中...",0);
            //交易信息
            const temp = {
                ...transaction,
                isPaid: true
            }
            const resp = await http.sendTransactionByModify("transaction:"+temp.orderId, temp);
            Toast.hide();
            if(resp.data && resp.data.error){
                const state = {
                    type: 0
                };
                this.props.history.replace({pathname: "/main/transaction/result",state})
            }else{
                const state = {
                    type: 2
                };
                this.props.history.replace({pathname: "/main/transaction/result",state})
            }
        }catch (e) {
            console.log(e);
        }
    }

    /**
     * 模拟路线轨迹
     */
    imitate = async () => {
        const {transaction} = this.state;
        if(transaction.gpsData){
            Toast.loading("正在上传GPS数据...",0);
            Toast.success("GPS数据上传成功，正在生成地图轨迹", 2);
            setTimeout(() => {
                Toast.hide();
                this.setState({hidden: false});
            }, 2000);
        }else{
            try {
                Toast.loading("正在上传GPS数据...",0);
                //交易信息
                const temp = {
                    ...transaction,
                    gpsData: gpsData //gps数据
                }
                const resp = await http.sendTransactionByModify("transaction:"+temp.orderId, temp);
                Toast.hide();
                if(resp.data && resp.data.error){
                    Toast.fail("GPS数据上传失败", 2);
                }else{
                    Toast.success("GPS数据上传成功，正在生成地图轨迹", 2);
                    console.log(resp.data.result.hash);
                    setTimeout(() => {
                        Toast.hide();
                        this.setState({hidden: false});
                    }, 2000);
                }
            }catch (e) {
                console.log(e);
            }
        }

    }

    /**
     * 完成订单
     */
    complete = async () => {
        const {transaction} = this.state;
        try {
            Toast.loading("正在执行订单中...",0);
            // 交易信息
            const temp = {
                ...transaction,
                isComplete: true
            }
            const resp = await http.sendTransactionByModify("transaction:"+temp.orderId, temp);
            if(resp.data && resp.data.error){
                Toast.fail("订单执行失败", 2);
            }else{
                Toast.success("订单执行成功", 2);
                console.log(resp.data.result.hash);
                setTimeout(() => {
                    Toast.hide();
                    this.props.history.goBack();
                }, 2000);
            }
        }catch (e) {
            console.log(e);
        }
    }

    render(){
        const {carInfo, pictures, transaction, type, hidden} = this.state;
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
                    订单交易详情
                </NavBar>
                <WhiteSpace size={"xl"}/>
                <WhiteSpace size={"xl"}/>
                {/*交易信息*/}
                <List renderHeader={() => <div>交易信息</div>}>
                    <InputItem
                        type={"number"}
                        disabled={true}
                        value={transaction.orderId.toString()}
                    >
                        订单号：
                    </InputItem>
                    <InputItem
                        type={"text"}
                        disabled={true}
                        value={timeStampToDateTime(transaction.time)}
                    >
                        订单创建时间：
                    </InputItem>
                    <InputItem
                        type={"text"}
                        disabled={true}
                        value={typeKeyToValue[type]}
                    >
                        订单状态：
                    </InputItem>
                </List>
                {/*租赁信息*/}
                <List renderHeader={() => <div>租赁信息</div>}>
                    <DatePicker
                        value={new Date(Number(transaction.begin))}
                        mode={"date"}
                    >
                        <List.Item
                            disabled={true}
                            arrow={"horizontal"}
                        >
                            租赁开始时间：
                        </List.Item>
                    </DatePicker>
                    <DatePicker
                        value={new Date(Number(transaction.end))}
                        mode={"date"}
                    >
                        <List.Item
                            disabled={true}
                            arrow={"horizontal"}
                        >
                            租赁结束时间：
                        </List.Item>
                    </DatePicker>
                    <InputItem
                        type={"number"}
                        disabled={true}
                        value={transaction.rentDays.toString()}
                        extra="天"
                    >
                        租赁天数：
                    </InputItem>
                    <InputItem
                        type={"number"}
                        disabled={true}
                        value={transaction.totalFee.toString()}
                        extra="元"
                    >
                        租赁总费用：
                    </InputItem>
                </List>
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
                        type={"number"}
                        disabled={true}
                        value={carInfo.displacement.toString()}
                        extra="L"
                    >
                        排量：
                    </InputItem>
                    <InputItem
                        type={"number"}
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
                <WhiteSpace size={"xl"}/>
                <WingBlank>
                    {type === 0 && (
                        <Button
                            type={"primary"}
                            size={"small"}
                            onClick={() => this.pay()}
                        >
                            去支付
                        </Button>
                    )}
                    {type === 1 && (
                        <>
                            <Button
                                type={"primary"}
                                size={"small"}
                                onClick={() => this.imitate()}
                            >
                                模拟行动轨迹
                            </Button>
                            <WhiteSpace size={"md"}/>
                            <div hidden={hidden}>
                                <iframe
                                    title="resg"
                                    srcDoc={map}
                                    style={{ width: '100%', border: '0px', height: '200px' }}
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                    scrolling="auto"
                                />
                            </div>
                            <WhiteSpace size={"md"}/>
                            <Button
                                type={"primary"}
                                size={"small"}
                                onClick={() => this.complete()}
                            >
                                完成订单
                            </Button>
                        </>
                    )}
                </WingBlank>
                <WhiteSpace size={"xl"}/>
            </div>
        )
    }
}