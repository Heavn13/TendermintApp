import React from "react";
import {Flex, Icon, List, SearchBar, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import {clearSearchHistory, getSearchHistory, jsonToDouble, setSearchHistory} from "../../util/commonUtil";
import CarItem from "../../components/CarItem";
import http from "../../util/http";
import {decodeBase64} from "../../util/decode";
const i_clear = require("../../assets/i_clear.svg");

/**
 * 搜索公益项目组件
 */
export default class Search extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            searchContent: "", //搜索内容
            carInfos: [], //车辆信息数组
            history: [] //搜索记录
        }
    }

    componentDidMount() {
        this.getHistory();
    }

    /**
     * 获取搜索历史记录
     */
    getHistory = () => {
        if(getSearchHistory()){
            const temp = getSearchHistory();
            this.setState({history: temp.reverse()});
        }
    };

    /**
     * 搜索
     * @param searchContent 搜索内容
     */
    search = async (searchContent) => {
        try {
            Toast.loading("正在搜索车辆信息中...", 0);
            this.setState({carInfos: []});
            const resp = await http.query("car",`'name':'${searchContent}'`);
            if(resp.data && resp.data.result.response.value){
                const carInfos = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                Toast.hide();
                if(carInfos.length > 0){
                    setSearchHistory(searchContent);
                    this.setState({carInfos}, () => this.getHistory());
                }
                else {
                    Toast.info("查询不到该车辆！", 2);
                }

            }else{
                Toast.info("查询不到该车辆！", 2);
            }
        }catch (e) {
            Toast.hide();
            console.log(e);
        }
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
        const {searchContent, carInfos, history} = this.state;
        return(
            <div className="search">
                {/*搜索栏*/}
                <Flex className="searchBar" justify={"between"}>
                    <Flex.Item style={{flex: 1, textAlign: "center"}}>
                        <Icon type="left" color={"#fff"} onClick={() => this.props.history.goBack()}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: 9}}>
                        <SearchBar
                            className="searchBar"
                            value={searchContent}
                            placeholder={"请输入商品名称"}
                            onChange={value => this.setState({searchContent: value})}
                            cancelText={"搜索"}
                            onCancel={() => this.search(searchContent)}
                            showCancelButton
                        />
                    </Flex.Item>
                </Flex>
                <List renderHeader={() => <Flex justify={"between"}>
                    <div>历史记录</div>
                    <img
                        className="clear"
                        src={i_clear}
                        alt={"清空"}
                        onClick={() => {
                            clearSearchHistory();
                            this.setState({history: []});
                        }}/>
                </Flex>}></List>
                {/*历史记录*/}
                <WingBlank>
                    <div className="history">
                        {history.map((item, index) => {
                            return (
                                <span
                                    key={index}
                                    className="tag"
                                    onClick={() => this.search(item)}
                                >
                                    {item}
                                </span>
                            )
                        })}
                    </div>
                </WingBlank>
                {/*车辆信息列表*/}
                <WhiteSpace size={"md"} />
                {carInfos.map((item, index) => {
                    return <CarItem key={index} carInfo={item} onItemClick={() => this.jumpToDetail(item)}/>
                })}
            </div>
        )
    }
}
