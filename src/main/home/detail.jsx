import React from "react";
import {
    DatePicker,
    Icon,
    ImagePicker,
    InputItem,
    List,
    NavBar,
    Radio,
    WhiteSpace,
    WingBlank
} from "antd-mobile";
import {defaultCarInfo} from "../../util/dict";
import {mask} from "../../components/BasicInfo";
import {millSecondsToDays} from "../../util/StringUtil";

const transmissionCaseKeyToValue = {
    0 : "自动",
    1 : "手动"
};

const inletKeyToValue = {
    0 : "自然进气",
    1 : "涡轮增压"
}

const parkingSensorKeyToValue = {
    0 : "有",
    1 : "无"
}

/**
 * 新增车辆信息界面
 */
export default class Detail extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            carInfo: defaultCarInfo,
            pictures: [],
        }
    }

    componentDidMount() {
        const params = this.props.history.location.state;
        // 从路由中获取数据
        if(params)
            this.setState({
                carInfo: params.carInfo
            }, () => this.initPictures());
    }

    initPictures = async() => {
        const {pictures, carInfo} = this.state;
        pictures.push({url: carInfo.url});
        this.setState({pictures});
    }

    render(){
        const {carInfo, pictures, type} = this.state;
        return(
            <div className="start">
                {/*导航栏*/}
                <NavBar
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    租赁车辆详情
                </NavBar>
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
                {/*租赁信息*/}
                <List renderHeader={() => <div>租赁信息</div>}>
                </List>
                <DatePicker
                    value={new Date(Number(carInfo.begin))}
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
                    value={new Date(Number(carInfo.end))}
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
                    value={millSecondsToDays(carInfo.end - carInfo.begin).toString()}
                    extra="天"
                >
                    租赁天数{mask}：
                </InputItem>
            </div>
        )
    }
}