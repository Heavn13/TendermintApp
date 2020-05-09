import "./index.css"
import React from "react";
import {Flex, List, Modal, NavBar, WhiteSpace} from "antd-mobile";
import {auth} from "../../util/auth";
import {defaultUser} from "../../util/dict";
import {ipfs} from "../../util/ipfs";
const i_setting = require("../../assets/i_setting_gray.svg");
const i_default_head = require("../../assets/i_default_head.svg");
const i_cert = require("../../assets/i_cert_gray.svg");
const i_cert_red = require("../../assets/i_cert_red.svg");
const i_info = require("../../assets/i_info.svg");
const i_person_cert = require("../../assets/i_person_cert.svg");
const i_logout = require("../../assets/i_logout.svg");

/**
 * 我的界面
 */
export default class Mine extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            user: defaultUser, //用户信息
            url: "" //头像
        }
    }

    componentDidMount() {
        this.setState({user: auth.getUser()}, () => this.init());
    }

    /**
     * 初始化头像信息
     */
    init = async () => {
        const {user} = this.state;
        try{
            if(user.picture){
                const picture = await ipfs.get(user.picture);
                console.log(picture);
                this.setState({url: picture});
            }
        }catch (e) {
            console.log(e);
        }
    };

    /**
     * 退出登录
     */
    logout = () => {
        Modal.alert(
            "提醒",
            "是否确认退出登录？该操作会清除所有用户信息！",
            [
                {text: "取消", onPress: () => {}},
                {text: "确认", onPress: () => {
                        // 清楚所有缓存信息
                        auth.removeUser();
                        this.props.history.replace("/login");
                    }}
            ]
        );
    };

    render(){
        const {user, url} = this.state;
        return(
            <div className="mine">
                <NavBar mode={"light"} rightContent={<img src={i_setting} alt={"设置"}/>}></NavBar>
                {/*用户基本信息*/}
                <div className="head">
                    <Flex justify={"start"}>
                        <img src={user.picture ? url : i_default_head} alt={"头像"}/>
                        <div className="right">
                            <div className="username">{user.nickname}</div>
                            <Flex justify={"start"} className="bottom">
                                <img src={user.isCert ? i_cert_red : i_cert} alt={"实名认证"}/>
                                <span>{user.isCert ? <span className="cert">已实名认证</span> : "未实名认证"}</span>
                            </Flex>
                        </div>
                    </Flex>
                </div>
                <WhiteSpace size={"lg"}/>
                <List>
                    <List.Item
                        thumb={i_info}
                        arrow={"horizontal"}
                        onClick={() => this.props.history.push("/main/mine/info")}
                    >个人信息</List.Item>
                    <List.Item
                        thumb={i_person_cert}
                        arrow={"horizontal"}
                        extra={user.isCert ? "已认证" : "未认证"}
                        onClick={() => this.props.history.push("/main/mine/cert")}
                    >实名认证</List.Item>
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