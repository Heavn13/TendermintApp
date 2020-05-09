import "./common.css"
import React from "react";
import {Icon, NavBar, Result} from "antd-mobile";

/**
 * 订单结果组件
 * @param user
 * @constructor
 */
export default class OrderResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 0 // 0 失败 1 待付款 2 成功
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
                        img={<Icon type="cross-circle-o" size={"lg"} className="spe" style={{ fill: '#F13642' }} />}
                        title="订单提交失败"
                        buttonText={"返回首页"}
                        onButtonClick={() => this.props.history.replace("/main")}
                    />
                )}
                {type === 1 && (
                    <Result
                        img={<Icon type="loading"  size={"lg"} className="spe" style={{ fill: '#ffc600' }} />}
                        title="等待付款"
                        buttonText={"去支付"}
                        onButtonClick={() => this.props.history.replace("/main/transaction")}
                    />
                )}
                {type === 2 && (
                    <Result
                        img={<Icon type="check-circle" size={"lg"}  className="spe" style={{ fill: '#6abf47' }} />}
                        title="订单提交成功"
                        buttonText={"查看详情"}
                        onButtonClick={() => this.props.history.replace("/main/transaction")}
                    />
                )}
            </div>
        )

    }
};