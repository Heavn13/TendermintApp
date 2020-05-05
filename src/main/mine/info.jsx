import React from "react";
import {Button, DatePicker, Icon, ImagePicker, List, Modal, NavBar, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import {defaultUser} from "../../util/dict";
import {auth} from "../../util/auth";
import http from "../../util/http";
import {jsonToDouble} from "../../util/StringUtil";
import {decodeBase64} from "../../util/decode";
import {ipfs} from "../../util/ipfs";
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
            url: "",
            pictures: [],
            popup: false
        }
    }

    componentDidMount() {
        this.setState({user: auth.getUser()}, () => this.initHeadPicture());
    }

    /**
     * 初始化头像
     */
    initHeadPicture = async () => {
        const {user, pictures} = this.state;
        if(user.picture){
            const picture = await ipfs.get(user.picture);
            pictures.push({url: picture});
            this.setState({pictures, url: picture});
        }
    };

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
                            case "nickname":
                                if(value.length > 12){
                                    Toast.info("用户昵称不能超过12个字符!");
                                    return;
                                }else if(value.length < 2){
                                    Toast.info("用户昵称不能少于2个字符!");
                                    return;
                                }
                                break;
                            case "phone":
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
        const {user} = this.state;
        try {
            Toast.loading("正在修改个人信息中...",0);
            const resp = await http.sendTransactionByModify("user:"+user.phone, user);
            if(resp.data && resp.data.error){
                Toast.fail("修改个人信息失败", 2);
            }else{
                const resp = await http.query("user:"+user.phone);
                if(resp.data && resp.data.result.response.value){
                    const user = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                    auth.setUser(user);
                    Toast.success("修改个人信息成功", 2);
                    console.log(resp.data.result.hash);
                }
            }
        }catch (e) {
            console.log(e);
        }
    };


    choosePicture = async () => {
        const {pictures, user} = this.state;
        try{
            const temp = pictures;
            const hash = await ipfs.add(temp[0].url);
            user.picture = hash;
            this.setState({user: user, popup: false, url: temp[0].url});
        }catch (e) {
            console.log(e);
        }
    };

    render(){
        const {user, pictures, popup, url} = this.state;
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
                        extra={<img className="head" src={pictures.length > 0 ? url : i_default_head} alt={"头像"}/>}
                        onClick={() => this.setState({popup: true})}
                    >头像</List.Item>
                    <List.Item
                        thumb={i_username}
                        arrow={"horizontal"}
                        extra={user.nickname}
                        onClick={() => this.modifyValue("用户昵称", "nickname")}
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
                        onClick={() => this.modifyValue("手机号", "phone")}
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