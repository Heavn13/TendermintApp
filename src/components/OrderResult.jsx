import "./common.css"
import React from "react";
import {Icon, NavBar, Result} from "antd-mobile";

/**
 * 用户基本信息组件
 * @param user
 * @constructor
 */
export default class OrderResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 0
        }
    }

    componentDidMount() {
        const params = this.props.history.location.state;
        // 从路由中获取数据
        if(params)
            this.setState({type: params.type});
    }

    render() {
        const {type} = this.state
        return(
            <div className="result">
                <NavBar>订单提交结果</NavBar>
                {type === 0 && (
                    <Result
                        img={<Icon type="cross-circle-o" className="spe" style={{ fill: '#F13642' }} />}
                        title="订单提交失败"
                        buttonText={"返回首页"}
                        onButtonClick={() => this.props.history.replace("/main")}
                    />
                )}
                {type === 1 && (
                    <Result
                        img={<Icon type="loading" className="spe" style={{ fill: '#ffc600' }} />}
                        title="等待付款"
                        buttonText={"去支付"}
                        onButtonClick={() => this.props.history.replace("/main/transaction")}
                    />
                )}
                {type === 2 && (
                    <Result
                        img={<Icon type="check-circle" className="spe" style={{ fill: '#6abf47' }} />}
                        title="订单提交成功"
                        buttonText={"查看详情"}
                        onButtonClick={() => this.props.history.replace("/main/transaction")}
                    />
                )}
            </div>
        )

    }
};