import React from "react";
import {
    Icon,
    ImagePicker,
    InputItem,
    List,
    NavBar,
    Radio,
    WhiteSpace,
    WingBlank,
    Button,
    Flex, Toast
} from "antd-mobile";
import {currentPosition, defaultCarInfo} from "../../util/dict";
import {mask} from "../../components/BasicInfo";
import {randCarId} from "../../util/commonUtil";
import http from "../../util/http";
import {ipfs} from "../../util/ipfs";

/**
 * keyValue转化
 * @type {({label: string, value: number}|{label: string, value: number})[]}
 */
const transmissionCaseItems = [
    {label:"自动", value: 0},
    {label:"手动", value: 1},
]

/**
 * keyValue转化
 * @type {({label: string, value: number}|{label: string, value: number})[]}
 */
const inletItems = [
    {label:"自然进气", value: 0},
    {label:"涡轮增压", value: 1},
];

/**
 * keyValue转化
 * @type {({label: string, value: number}|{label: string, value: number})[]}
 */
const parkingSensorItems = [
    {label:"有", value: 0},
    {label:"无", value: 1},
];

/**
 * 新增/修改车辆信息界面
 */
export default class Car extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            carInfo: defaultCarInfo, //车辆信息
            pictures: [], //车辆图片
            type: 0 // 0 新增 1 修改
        }
    }

    componentDidMount() {
        const params = this.props.history.location.state;
        // 从路由参数中获取数据
        if(params)
            this.setState({
                type: params.type,
                carInfo: params.type === 1 ? params.carInfo : defaultCarInfo
            }, () => this.initPictures());
    }

    /**
     * 初始化图片
     * @returns {Promise<void>}
     */
    initPictures = () => {
        const {pictures, carInfo, type} = this.state;
        if(type === 1){
            pictures.push({url: carInfo.url});
            this.setState({pictures});
        }
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
        this.setState({carInfo: {...this.state.carInfo, ...newValue}});
    };

    /**
     * 新增车辆信息
     */
    submit = async () => {
        const {carInfo, pictures} = this.state;
        try {
            Toast.loading("正在提交车辆信息中...",0);
            const hash = await ipfs.add(pictures[0].url);
            const position = currentPosition[Math.floor(Math.random()*currentPosition.length)]
            // 车辆信息
            const temp = {
                ...carInfo,
                id: randCarId(),
                picture: hash,
                url: "",
                location: position,
                time: Date.now()
            }
            const resp = await http.sendTransactionByAdd("car:"+temp.id, temp);
            if(resp.data && resp.data.error){
                Toast.fail("车辆信息添加失败");
            }else{
                Toast.success("车辆信息添加成功", 2);
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

    /**
     * 修改车辆信息
     */
    modify = async () => {
        const {carInfo, pictures} = this.state;
        try {
            Toast.loading("正在修改车辆信息中...",0);
            const hash = await ipfs.add(pictures[0].url);
            // 车辆信息
            const temp = {
                ...carInfo,
                picture: hash,
                url: "",
                time: Date.now()
            }
            const resp = await http.sendTransactionByModify("car:"+temp.id, temp);
            if(resp.data && resp.data.error){
                Toast.fail("车辆信息修改失败");
            }else{
                Toast.success("车辆信息修改成功", 2);
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

    /**
     * 删除车辆信息
     */
    delete = async () => {
        const {carInfo} = this.state;
        try {
            Toast.loading("正在删除车辆信息中...",0);
            const resp = await http.sendTransactionByDelete("car:"+carInfo.id);
            if(resp.data && resp.data.error){
                Toast.fail("车辆信息删除失败");
            }else{
                Toast.success("车辆信息删除成功", 2);
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
        const {carInfo, pictures, type} = this.state;
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
                    {type === 0 ? "新增车辆信息" : "管理车辆信息"}
                </NavBar>
                <WhiteSpace size={"xl"}/>
                <WhiteSpace size={"xl"}/>
                {/*车辆基本信息*/}
                <List renderHeader={() => <div>车辆基本信息</div>}>
                    <InputItem
                        type={"text"}
                        clear
                        maxLength={20}
                        value={carInfo.name}
                        placeholder={"请输入车辆名称"}
                        onChange={value => this.modifyValue("name", value)}
                    >
                        车辆名称{mask}：
                    </InputItem>
                    <InputItem
                        type={"text"}
                        clear
                        maxLength={20}
                        value={carInfo.brand}
                        placeholder={"请输入车辆品牌"}
                        onChange={value => this.modifyValue("brand", value)}
                    >
                        车辆品牌{mask}：
                    </InputItem>
                    <List.Item>
                        <div>车辆图片{mask}：</div>
                        <WhiteSpace size={"sm"}/>
                        <WingBlank>
                            <ImagePicker
                                files={pictures}
                                onImageClick={(index, fs) => console.log(index, fs)}
                                length={3}
                                onChange={(files, type, index) => {
                                    console.log(files, type, index);
                                    this.setState({pictures: files})
                                }}
                                selectable={pictures.length < 1}
                            />
                            <WhiteSpace size={"sm"}/>
                        </WingBlank>
                    </List.Item>
                    <div className={"choose"}>
                        <span>变速箱类型{mask}：</span>
                        {transmissionCaseItems.map((item, index) => {
                            return(
                                <Radio
                                    key={index}
                                    className="radio"
                                    checked={item.value === carInfo.transmissionCase}
                                    onChange={() => this.modifyValue("transmissionCase", item.value)}
                                >
                                    <span className="label">{item.label}</span>
                                </Radio>
                            )
                        })}
                    </div>
                    <InputItem
                        type={"number"}
                        maxLength={7}
                        placeholder={"请输入油箱容量"}
                        value={carInfo.tankCapacity.toString()}
                        onChange={value => this.modifyValue("tankCapacity", Number(value))}
                        extra="L"
                    >
                        油箱容量{mask}：
                    </InputItem>
                    <InputItem
                        type={"number"}
                        maxLength={7}
                        placeholder={"请输入排量"}
                        value={carInfo.displacement.toString()}
                        onChange={value => this.modifyValue("displacement", Number(value))}
                        extra="L"
                    >
                        排量{mask}：
                    </InputItem>
                    <InputItem
                        type={"number"}
                        maxLength={7}
                        placeholder={"请输入百公里消耗"}
                        value={carInfo.consumption.toString()}
                        onChange={value => this.modifyValue("consumption", Number(value))}
                        extra="L/100km"
                    >
                        百公里消耗{mask}：
                    </InputItem>
                    <InputItem
                        type={"number"}
                        maxLength={2}
                        placeholder={"请输入座位数"}
                        value={carInfo.seats.toString()}
                        onChange={value => this.modifyValue("seats", Number(value))}
                        extra="位"
                    >
                        座位数{mask}：
                    </InputItem>
                    <div className={"choose"}>
                        <span>进气{mask}：</span>
                        {inletItems.map((item, index) => {
                            return(
                                <Radio
                                    key={index}
                                    className="radio"
                                    checked={item.value === carInfo.inlet}
                                    onChange={() => this.modifyValue("inlet", item.value)}
                                >
                                    <span className="label">{item.label}</span>
                                </Radio>
                            )
                        })}
                    </div>
                    <div className={"choose"}>
                        <span>倒车雷达{mask}：</span>
                        {parkingSensorItems.map((item, index) => {
                            return(
                                <Radio
                                    key={index}
                                    className="radio"
                                    checked={item.value === carInfo.parkingSensor}
                                    onChange={() => this.modifyValue("parkingSensor", item.value)}
                                >
                                    <span className="label">{item.label}</span>
                                </Radio>
                            )
                        })}
                    </div>
                    <InputItem
                        type={"number"}
                        maxLength={7}
                        placeholder={"请输入日租车费用"}
                        value={carInfo.rentFee.toString()}
                        onChange={value => this.modifyValue("rentFee", Number(value))}
                        extra="元"
                    >
                        日租车费用{mask}：
                    </InputItem>
                </List>
                <WhiteSpace size={"xl"}/>
                <WingBlank>
                    {type === 0 ? (
                        <Button
                            type={"primary"}
                            size={"small"}
                            onClick={() => this.submit()}
                            disabled={!carInfo.name || !carInfo.brand || carInfo.tankCapacity === 0
                            || carInfo.displacement === 0 || carInfo.consumption === 0
                            || carInfo.seats === 0 || carInfo.rentFee === 0 || pictures.length <= 0}
                        >
                            提交
                        </Button>
                    ) : (
                        <Flex justify={"between"}>
                            <Flex.Item>
                                <Button type={"primary"} size={"small"} onClick={() => this.delete()}>删除</Button>
                            </Flex.Item>
                            <Flex.Item>
                                <Button type={"primary"} size={"small"} onClick={() => this.modify()}>修改</Button>
                            </Flex.Item>
                        </Flex>
                    )}
                </WingBlank>
                <WhiteSpace size={"xl"}/>
            </div>
        )
    }
}