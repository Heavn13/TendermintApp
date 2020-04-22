import React from "react";
import http from "../util/http";
import {decodeBase64} from "../util/decode";
import {Button, Col, Input, Message, Row} from "antd";
import WhiteSpace from "../components/WhiteSpace";
import {jsonToDouble} from "../util/StringUtil";
const i_phone = require("../assets/i_phone.svg");
const i_password = require("../assets/i_password.svg");

/**
 * 用户登录界面
 */
export default class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            phone: "", //手机号码
            password: "", //密码
        }
    }

    toLogin = async () => {
        const {phone, pasword} = this.state;
        try {
            const resp = await http.query(phone);
            if(resp.data && resp.data.result.response.value){
                const user = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                if(user.password === pasword){
                    Message.info("登陆成功");
                }else{
                    Message.error("密码错误");
                }
            }else{
                Message.error("用户不存在");
            }
        }catch (e) {
            console.log(e);
        }
    }

    render(){
        const {phone, password} = this.state;
        return(
            <div className="login">
                <Row>
                    <Col span={6} offset={9}>
                        <div style={{height: 100}}></div>
                        <div className={"name"}>TendermintApp</div>
                        <WhiteSpace size={"middle"}/>
                        <Input
                            allowClear
                            maxLength={11}
                            placeholder={"请输入手机号码"}
                            prefix={<img src={i_phone} alt={"手机号:"}/>}
                            value={phone}
                            onChange={e => this.setState({phone: e.target.value})}
                        />
                        <WhiteSpace size={"middle"}/>
                        <Input.Password
                            maxLength={16}
                            placeholder={"请输入8-16位密码"}
                            value={password}
                            prefix={<img src={i_password} alt={"密码:"}/>}
                            onChange={e => this.setState({password: e.target.value})}
                        />
                        <WhiteSpace size={"middle"}/>
                        <Button
                            type={"primary"}
                            style={{width: '100%'}}
                            disabled={phone.length !== 11 || !password}
                            onClick={() => this.toLogin()}
                        >
                            登录
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }

}