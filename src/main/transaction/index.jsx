import "./index.css"
import React from "react";
import {WhiteSpace, SegmentedControl, WingBlank, Toast, PullToRefresh} from "antd-mobile";
import http from "../../util/http";
import {jsonToDouble} from "../../util/StringUtil";
import {decodeBase64} from "../../util/decode";
import {defaultUser} from "../../util/dict";
import {auth} from "../../util/auth";
import OrderItem from "../../components/Ordertem";


export default class Transaction extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            user: defaultUser,
            waitOrders: [],
            processingOrders: [],
            completeOrders: [],
            refreshing: false
        }
    }

    componentDidMount() {
        this.setState({user: auth.getUser()}, () => this.getAllOrders());
    }

    getAllOrders = async () => {
        const {user} = this.state;
        try {
            const resp = await http.query("transaction",`'userPhone':'${user.phone}'`);
            if(resp.data && resp.data.result.response.value){
                const allOrders = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                console.log(allOrders);
                const waitOrders = allOrders.filter(i => !i.isPaid);
                const processingOrders = allOrders.filter(i => i.isPaid && !i.isComplete);
                const completeOrders = allOrders.filter(i => i.isComplete);
                this.setState({waitOrders,processingOrders,completeOrders}, () => console.log(this.state));
            }else{
                Toast.fail("数据不存在");
            }
        }catch (e) {
            console.log(e);
        }
    }

    jumpToDetail = (transaction) => {
        const {selectedIndex} = this.state;
        const state = {
            transaction: transaction,
            type: selectedIndex
        };
        this.props.history.push({pathname: "/main/transaction/detail", state})
    };


    render(){
        const {selectedIndex, refreshing, waitOrders, processingOrders, completeOrders} = this.state;
        return(
            <div className="transaction">
                {/*消息类型分段选择器*/}
                <div>
                    <WhiteSpace size={"md"}/>
                    <WingBlank>
                        <SegmentedControl
                            selectedIndex={selectedIndex}
                            onChange={e => this.setState({selectedIndex: e.nativeEvent.selectedSegmentIndex})}
                            values={["待付款", "进行中", "已完成"]}>
                        </SegmentedControl>
                    </WingBlank>
                </div>
                <WhiteSpace size={"md"}/>
                {/*上拉刷新*/}
                <PullToRefresh
                    damping={40}
                    style={{
                        width: '100%',
                        overflow: 'auto',
                    }}
                    indicator={{ activate: '松开立即刷新' }}
                    direction={'down'}
                    refreshing={refreshing}
                    onRefresh={() => this.getData()}
                >
                    <div className="orderList">
                        {selectedIndex === 0 && waitOrders.length > 0 ? waitOrders.map((item, index) => {
                            return(
                                <OrderItem key={index} order={item} onItemClick={() => this.jumpToDetail(item)}/>
                            )
                        }): null}
                        {selectedIndex === 1 && processingOrders.length > 0 ? processingOrders.map((item, index) => {
                            return(
                                <OrderItem key={index} order={item} onItemClick={() => this.jumpToDetail(item)}/>
                            )
                        }): null}
                        {selectedIndex === 2 && completeOrders.length > 0 ? completeOrders.map((item, index) => {
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