import React from "react";
import {Flex, List, Modal, NavBar, WhiteSpace} from "antd-mobile";
import {auth} from "../util/auth";
const i_default_head = require("../assets/i_default_head.svg");
const i_manage = require("../assets/i_manage.svg");
const i_logout = require("../assets/i_logout.svg");

/**
 * 系统管理员设置界面
 */
export default class Setting extends React.Component{

    /**
     * 退出登录状态
     */
    logout = () => {
        Modal.alert(
            "提醒",
            "是否确认退出系统管理员界面？",
            [
                {text: "取消", onPress: () => {}},
                {text: "确认", onPress: () => {
                        auth.removeUser();
                        this.props.history.replace("/login");
                    }}
            ]
        );
    };

    render(){
        return(
            <div className="setting">
                <NavBar mode={"light"}></NavBar>
                <div className="head">
                    <Flex justify={"start"}>
                        <img src={i_default_head} alt={"头像"}/>
                        <div className="right">
                            <div className="username">系统管理员</div>
                            <div className="summary">主要职责：审核实名认证；租赁信息管理</div>
                        </div>
                    </Flex>
                </div>
                <WhiteSpace size={"lg"}/>
                {/*功能列表*/}
                <List>
                    <List.Item
                        thumb={i_manage}
                        arrow={"horizontal"}
                        onClick={() => this.props.history.push("/admin/manage")}
                    >租赁管理</List.Item>
                    <List.Item
                        thumb={i_logout}
                        arrow={"horizontal"}
                        onClick={() => this.logout()}
                    >退出登录</List.Item>
                </List>
            </div>
        )
    }
}