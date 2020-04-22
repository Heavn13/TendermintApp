import React from "react";
import {PhoneFormat} from "../util/StringUtil";
import {Button, Message, Input, Row, Col, Space} from "antd";
import {CheckOutlined} from '@ant-design/icons';
import WhiteSpace from "../components/WhiteSpace";
import "./index.css"
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
        const {phone, password, smsCode} = this.state;
        // 密码长度教研
        if(password.length < 8) {
            Message.info("密码长度太短，请重新设置");
            this.setState({password: ""});
            return ;
        }
    };

    render(){
        const {phone, password, smsCode, isSend, time} = this.state;
        return(
            <div className="register">
                <Row>
                    <Col span={6} offset={9}>
                        <div className="content">
                            <div style={{height: 100}}></div>
                            <div className={"name"}>TendermintApp</div>
                            <WhiteSpace/>
                            <Input
                                allowClear
                                maxLength={11}
                                placeholder={"请输入手机号码"}
                                prefix={<img src={i_phone} alt={"手机号:"}/>}
                                value={phone}
                                onChange={e => this.setState({phone: e.target.value})}
                            />
                            <WhiteSpace/>
                            <Input
                                maxLength={6}
                                placeholder={"请输入验证码"}
                                value={smsCode}
                                onChange={e => this.setState({smsCode: e.target.value})}
                                prefix={<img src={i_smscode} alt={"验证码:"}/>}
                                suffix={
                                    <Button
                                        type={"primary"}
                                        onClick={this.send}
                                        disabled={isSend || PhoneFormat(phone).length !== 11 }>{isSend ? time + " s" : "发送"}</Button>
                                }
                            />
                            <WhiteSpace/>
                            <Input.Password
                                maxLength={16}
                                placeholder={"请输入8-16位密码"}
                                value={password}
                                prefix={<img src={i_password} alt={"密码:"}/>}
                                onChange={e => this.setState({password: e.target.value})}
                            />
                            {isSend ? (
                                <div className="hint">
                                    <WhiteSpace/>
                                    <CheckOutlined /><span className="message">短信验证码已发送,请注意查收</span>
                                </div>
                            ): null}
                            <WhiteSpace/>
                            <Button
                                type={"primary"}
                                style={{width: '100%'}}
                                disabled={phone.length !== 11 || !password || !smsCode }
                                onClick={() => this.toRegister()}
                            >
                                注册
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}