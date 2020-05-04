import React from "react";
import {PhoneFormat} from "../util/StringUtil";
import {Button, NavBar, Icon, InputItem, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import "./index.css"
import http from "../util/http";
const i_phone = require("../assets/i_phone.svg");
const i_smscode = require("../assets/i_smscode.svg");
const i_password = require("../assets/i_password.svg");

/**
 * 用户注册界面
 */
export default class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            phone: "", //手机号码
            smsCode: "", //验证码
            password: "", //密码
            isSend: false, //发送状态
            time: 60 //倒计时
        }
    }

    /**
     * 发送短信验证码
     */
    send = async () => {
        let {time} = this.state;
        try {
            this.setState({isSend: true});
            const T = setInterval(() => {
                this.setState({time: --time});
                if(time === 0) {
                    clearInterval(T);
                    this.setState({isSend: false});
                }
            },1000)
        }catch (e) {
            console.log(e);
        }
    };

    /**
     * 注册
     */
    toRegister = async () =>{
        const {phone, password} = this.state;
        // 密码长度校验
        if(password.length < 8) {
            Toast.info("密码长度太短，请重新设置");
            this.setState({password: ""});
            return ;
        }
        try {
            const user = {
                phone: phone,
                password: password
            }
            const resp = await http.sendTransaction(user.phone, user);
            if(resp.data && resp.data.error){
                Toast.fail("该用户已存在");
            }else{
                Toast.success("注册成功");
                console.log(resp.data.result.hash);
            }
        }catch (e) {
            console.log(e);
        }
    };

    render(){
        const {phone, password, smsCode, isSend, time} = this.state;
        return(
            <div className="register">
                {/*导航栏*/}
                <NavBar
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    注册
                </NavBar>
                <WingBlank className="content">
                    <div style={{height: 100}}></div>
                    <InputItem
                        type={"phone"}
                        clear
                        placeholder={"请输入手机号码"}
                        value={phone}
                        onChange={phone => this.setState({phone})}
                    >
                        <img src={i_phone} alt={"手机号:"}/>
                    </InputItem>
                    <WhiteSpace />
                    <InputItem
                        maxLength={6}
                        type={"number"}
                        placeholder={"请输入验证码"}
                        value={smsCode}
                        onChange={smsCode => this.setState({smsCode})}
                        extra={
                            <Button
                                type={"primary"}
                                size={"small"}
                                onClick={this.send}
                                disabled={isSend || PhoneFormat(phone).length !== 11 }>{isSend ? time + " s" : "发送"}</Button>
                        }
                        onExtraClick={() => {}}
                    >
                        <img src={i_smscode} alt={"验证码:"}/>
                    </InputItem>
                    <WhiteSpace />
                    <InputItem
                        maxLength={16}
                        type={"password"}
                        clear
                        placeholder={"请输入8-16位密码"}
                        value={password}
                        onChange={password => this.setState({password})}
                    >
                        <img src={i_password}  alt={"密码:"}/>
                    </InputItem>
                    <WhiteSpace />
                    {isSend ? (
                        <div className="hint">
                            <Icon type={"check-circle-o"}/><span className="message">短信验证码已发送,请注意查收</span>
                        </div>
                    ): null}
                    <WhiteSpace />
                    <Button
                        type={"primary"}
                        size={"small"}
                        disabled={PhoneFormat(phone).length !== 11 || !password || !smsCode }
                        onClick={() => this.toRegister()}
                    >
                        注册
                    </Button>
                </WingBlank>
            </div>
        )
    }
}