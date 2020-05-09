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
import {jsonToDouble} from "../../util/StringUtil";
import {decodeBase64} from "../../util/decode";
import {ipfs} from "../../util/ipfs";
const i_scan = require("../../assets/i_scan.svg");
const i_location = require("../../assets/i_location.svg");


export default class Home extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            carInfos: [],
            refreshing: false,
            searchContent: ""
        }
    }

    componentDidMount() {
        this.getData();
    }

    /**
     * 获取参与/发起的项目数据
     * @returns {Promise<void>}
     */
    getData = async () => {
        try {
            const resp = await http.query("car","");
            if(resp.data && resp.data.result.response.value){
                const carInfos = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                console.log(carInfos);
                // 获取图片
                for(const carInfo of carInfos){
                    const result = await ipfs.get(carInfo.picture);
                    carInfo.url = result;
                }
                this.setState({carInfos: carInfos});
            }else{
                Toast.fail("数据不存在");
            }
        }catch (e) {
            console.log(e);
        }
    };

    /**
     * 跳转至管理项目界面
     * @param type 项目类型
     * @param project 项目信息
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
                            onFocus={() => {}}
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
                        marginTop: 40
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