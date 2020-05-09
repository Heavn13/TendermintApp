import "./common.css"
import React from "react";
import {timeStampToDateTime, timeStampToDate} from "../util/commonUtil";

/**
 * 订单基本信息组件
 * @param order
 * @constructor
 */
export default class OrderItem extends React.Component {
    render() {
        const {order, onItemClick} = this.props
        return(
            <div className="orderItem" onClick={() => onItemClick(order)}>
                <div className="content">订单号：{order.orderId}</div>
                <div className="content">租赁车辆名称：{order.carName}</div>
                <div className="content">租赁时间：{timeStampToDate(order.begin)} - {timeStampToDate(order.end)}</div>
                <div className="content">租赁总费用：{order.totalFee}元</div>
                <div className="content">订单创建时间：{timeStampToDateTime(order.time)}</div>
            </div>
        )
    }
};