import React from "react";
import {Button, DatePicker, Icon, ImagePicker, List, Modal, NavBar, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import {defaultUser} from "../../util/dict";
import {auth} from "../../util/auth";
const i_default_head = require("../../assets/i_default_head.svg");
const i_person_cert = require("../../assets/i_person_cert.svg");
const i_username = require("../../assets/i_username.svg");
const i_head = require("../../assets/i_head.svg");
const i_phone = require("../../assets/i_phone.svg");
const i_birthday = require("../../assets/i_birthday.svg");
const i_mail = require("../../assets/i_mail.svg");

/**
 * 用户个人信息组件
 */
export default class Information extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            user: defaultUser,
            pictures: [],
            popup: false
        }
    }

    componentDidMount() {
        this.setState({user: auth.getUser()});
    }

    /**
     * 修改值的公共方法
     * @param title 字段
     * @param key
     */
    modifyValue = (title, key) => {
        Modal.prompt(
            "请输入您的"+title,
            "",
            [
                {text: "取消"},
                {text: "确认", onPress:value => {
                        switch (key) {
                            case "userName":
                                if(value.length > 12){
                                    Toast.info("用户昵称不能超过12个字符!");
                                    return;
                                }else if(value.length < 2){
                                    Toast.info("用户昵称不能少于2个字符!");
                                    return;
                                }
                                break;
                            case "userPhone":
                                const r1 = /^1[3456789]\d{9}$/
                                if(!r1.test(value)){
                                    Toast.info("手机号码格式不正确!");
                                    return;
                                }
                                break;
                            case "mail":
                                const r2 = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                                if(!r2.test(value)){
                                    Toast.info("邮箱地址格式不正确!");
                                    return;
                                }
                                break;
                            default:
                                break;
                        }
                        const newValue = {
                            [key]: value
                        };
                        this.setState({user: {...this.state.user, ...newValue}})}
                }
            ]

        )
    };

    /**
     * 修改个人信息
     */
    toSave = async () => {

    };

    // 选择头像
    choosePicture = async () => {

    };

    render(){
        const {user, pictures, popup} = this.state;
        return(
            <div className="info">
                <NavBar
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                    rightContent={<span onClick={() => this.toSave()}>{"保存"}</span>}
                >
                    个人信息
                </NavBar>
                <List renderHeader={<div>基本信息</div>}>
                    <List.Item
                        thumb={i_head}
                        arrow={"horizontal"}
                        extra={<img className="head" src={i_default_head} alt={"头像"}/>}
                        onClick={() => this.setState({popup: true})}
                    >头像</List.Item>
                    <List.Item
                        thumb={i_username}
                        arrow={"horizontal"}
                        extra={user.nickname}
                        onClick={() => this.modifyValue("用户昵称", "userName")}
                    >用户昵称</List.Item>
                    <DatePicker
                        value={new Date(Number(user.birthday))}
                        mode={"date"}
                        minDate={new Date(1900, 1, 1, 0, 0, 0)}
                        maxDate={new Date()}
                        onChange={date => {
                            user.birthday = date.valueOf();
                            this.setState({user: user}, () => console.log(this.state.user));
                        }}
                    >
                        <List.Item
                            thumb={i_birthday}
                            arrow={"horizontal"}
                        >
                            生日
                        </List.Item>
                    </DatePicker>

                </List>
                <List renderHeader={<div>账户信息</div>}>
                    <List.Item
                        thumb={i_phone}
                        arrow={"horizontal"}
                        extra={user.phone}
                        onClick={() => this.modifyValue("手机号", "userPhone")}
                    >手机号</List.Item>
                    <List.Item
                        className="mail"
                        thumb={i_mail}
                        arrow={"horizontal"}
                        extra={user.mail}
                        onClick={() => this.modifyValue("邮箱地址", "mail")}
                    >邮箱</List.Item>
                </List>
                <List renderHeader={<div>认证信息</div>}>
                    <List.Item
                        thumb={i_person_cert}
                        arrow={"horizontal"}
                        extra={user.isCert ? "已实名认证" : "未认证"}
                        onClick={() => this.props.history.push("/main/mine/auth/person")}
                    >实名认证</List.Item>
                </List>
                {/*选择图片弹出框*/}
                <Modal
                    popup
                    className="popup"
                    animationType={"slide-up"}
                    visible={popup}
                    onClose={() => this.setState({popup: false})}
                >
                    <WhiteSpace size={"md"}/>
                    <div>请选择一张图片作为您的头像：</div>
                    <WhiteSpace size={"md"}/>
                    <div className="picture">
                        <ImagePicker
                            files={pictures}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            length={1}
                            onChange={(files, type, index) => {
                                console.log(files, type, index);
                                this.setState({
                                    pictures: files,
                                });
                            }}
                            selectable={pictures.length < 1}
                        />
                    </div>
                    <WhiteSpace size={"sm"}/>
                    <WingBlank>
                        <Button type={"primary"} size={"small"} onClick={() => this.choosePicture()}>确认</Button>
                    </WingBlank>
                    <WhiteSpace size={"xl"}/>
                </Modal>
            </div>
        )
    }

}