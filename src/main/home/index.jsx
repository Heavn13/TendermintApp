import "./index.css"
import React from "react";
import {
    Flex,
    SearchBar,
    PullToRefresh, Toast,
    WhiteSpace,
} from "antd-mobile";
import CarItem from "../../components/CarItem";
import http from "../../util/http";
import {jsonToDouble, randCarId} from "../../util/commonUtil";
import {decodeBase64} from "../../util/decode";
import {ipfs} from "../../util/ipfs";
const i_scan = require("../../assets/i_scan.svg");
const i_location = require("../../assets/i_location.svg");
const data = require("../../assets/carInfos.json") ;
const p1 = require("../../assets/picture/1.jpg");
const p2 = require("../../assets/picture/2.jpg");
const p3 = require("../../assets/picture/3.jpeg");
const p4 = require("../../assets/picture/4.jpg");
const p5 = require("../../assets/picture/5.jpg");

/**
 * 首页展示租赁信息界面
 */
export default class Home extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            carInfos: [], //车辆信息数组
            refreshing: false, //刷新状态
            searchContent: "" //搜索内容
        }
    }

    async componentDidMount() {
        await this.init();
        await this.getData();
    }

    /**
     * 初始化车辆信息
     * @returns {Promise<void>}
     */
    init = async () => {
        try {
            const resp = await http.query("car","");
            if(resp.data && resp.data.result.response.value){
                const carInfos = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                if(carInfos.length <= 0){
                    Toast.loading("正在自动生成车辆信息中...",0);
                    let i = 1;
                    for(const item of data){
                        const hash = await ipfs.add(eval("p"+i));
                        const temp = {
                            ...item,
                            id: randCarId(),
                            picture: hash
                        }
                        await http.sendTransactionByAdd("car:"+temp.id, temp);
                        i ++;
                    }
                    Toast.hide();
                }
            }
        }catch (e) {
            Toast.hide();
            console.log(e);
        }
    }

    /**
     * 获取车辆信息数组
     * @returns {Promise<void>}
     */
    getData = async () => {
        try {
            Toast.loading("正在获取车辆信息中...",0);
            const resp = await http.query("car","");
            if(resp.data && resp.data.result.response.value){
                const carInfos = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                // 获取图片
                for(const carInfo of carInfos){
                    const result = await ipfs.get(carInfo.picture);
                    carInfo.url = result;
                }
                this.setState({carInfos: carInfos});
            }else{
                Toast.fail("数据不存在");
            }
            Toast.hide();
        }catch (e) {
            Toast.hide();
            console.log(e);
        }
    };
    /**
     * 跳转至搜索页面
     */
    jumpToSearch = () => {
        this.props.history.push("/main/home/search");
    };


    /**
     * 跳转至车辆详细信息界面
     * @param carInfo 车辆信息
     */
    jumpToDetail = (carInfo) => {
        const state = {
            carInfo: carInfo
        };
        this.props.history.push({pathname: "/main/home/detail", state})
    };

    render(){
        const {carInfos, refreshing, searchContent} = this.state;
        return(
            <div className="project">
                {/*搜索栏*/}
                <Flex className="bar" justify={"between"}>
                    <Flex.Item style={{flex: 1.5, textAlign: "center"}}>
                        <img src={i_location} alt={"定位"}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: 1, textAlign: "left"}}>
                        <div>北京</div>
                    </Flex.Item>
                    <Flex.Item style={{flex: 7}}>
                        <SearchBar
                            className="searchBar"
                            value={searchContent}
                            placeholder={"请输入商品名称"}
                            onFocus={() => this.jumpToSearch()}
                            onChange={value => this.setState({searchContent: value})}
                        />
                    </Flex.Item>
                    <Flex.Item style={{flex: 1.5}}>
                        <img src={i_scan} alt={"扫描"}/>
                    </Flex.Item>
                </Flex>
                <WhiteSpace size={"md"}/>
                {/*上拉刷新*/}
                <PullToRefresh
                    damping={40}
                    style={{
                        width: '100%',
                        overflow: 'auto',
                        marginTop: '45px'
                    }}
                    indicator={{ activate: '松开立即刷新' }}
                    direction={'down'}
                    refreshing={refreshing}
                    onRefresh={() => this.getData()}
                >
                    <div className="carList">
                        {carInfos.length > 0 ? carInfos.map((item, index) => {
                            return(
                                <CarItem key={index} carInfo={item} onItemClick={() => this.jumpToDetail(item)}/>
                            )
                        }): null}
                        <WhiteSpace size={"xl"}/>
                        <WhiteSpace size={"xl"}/>
                        <WhiteSpace size={"xl"}/>
                    </div>
                </PullToRefresh>
            </div>
        )
    }
}