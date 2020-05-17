import "./index.css"
import React from "react";
import {
    SearchBar,
    PullToRefresh, Toast,
    WhiteSpace, Flex, Icon,
} from "antd-mobile";
import http from "../../util/http";
import {jsonToDouble} from "../../util/commonUtil";
import {decodeBase64} from "../../util/decode";
import OrderItem from "../../components/OrderItem";

/**
 * 系统管理员查看订单界面
 */
export default class Order extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            orderInfos: [], //车辆信息数组
            refreshing: false, //刷新状态
            searchContent: "" //搜索内容
        }
    }

    componentDidMount() {
        this.getData();
    }

    /**
     * 获取车辆信息数组
     * @returns {Promise<void>}
     */
    getData = async () => {
        try {
            const resp = await http.query("transaction","");
            if(resp.data && resp.data.result.response.value){
                const orderInfos = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                this.setState({orderInfos});
            }else{
                Toast.fail("数据不存在");
            }
        }catch (e) {
            console.log(e);
        }
    };

    /**
     * 搜索
     * @param searchContent 搜索内容
     */
    search = async (searchContent) => {
        try {
            Toast.loading("正在搜索车辆相关订单信息中...", 0);
            this.setState({orderInfos: []});
            const resp = await http.query("transaction",`'carId':${Number(searchContent)}`);
            if(resp.data && resp.data.result.response.value){
                const orderInfos = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                Toast.hide();
                if(orderInfos.length > 0){
                    this.setState({orderInfos});
                }
                else {
                    Toast.info("查询不到该车辆的相关租赁信息！", 2);
                }

            }else{
                Toast.info("查询不到该车辆的相关租赁信息！", 2);
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
    jumpToDetail = (orderInfo) => {
        const state = {
            transaction: orderInfo
        };
        this.props.history.push({pathname: "/admin/order/detail", state})
    };

    render(){
        const {orderInfos, refreshing, searchContent} = this.state;
        return(
            <div className="project">
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
                <WhiteSpace size={"md"}/>
                {/*上拉刷新*/}
                <PullToRefresh
                    damping={40}
                    style={{
                        width: '100%',
                        overflow: 'auto'
                    }}
                    indicator={{ activate: '松开立即刷新' }}
                    direction={'down'}
                    refreshing={refreshing}
                    onRefresh={() => this.getData()}
                >
                    <div className="carList">
                        {orderInfos.length > 0 ? orderInfos.map((item, index) => {
                            return(
                                <OrderItem key={index} order={item} onItemClick={() => this.jumpToDetail(item)}/>
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