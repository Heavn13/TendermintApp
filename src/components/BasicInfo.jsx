import "./common.css"
import React from "react";
import {List} from "antd-mobile";
const i_username = require("../assets/i_username.svg");
const i_phone = require("../assets/i_phone.svg");

export const mask = <span className="mask">*</span>;

/**
 * 用户基本信息组件
 * @param user
 * @constructor
 */
export default class BasicInfo extends React.Component {
    render() {
        const {user} = this.props
        return(
            <div className="info">
                <List renderHeader={<div>基本信息</div>}>
                    <List.Item
                        thumb={i_username}
                        extra={user.nickname}
                    >用户昵称</List.Item>
                    <List.Item
                        thumb={i_phone}
                        extra={user.phone}
                    >手机号</List.Item>
                </List>
            </div>
        )

    }
};