import "./index.css"
import React from "react";
import http from "../util/http";
import {decodeBase64} from "../util/decode";
import {Button, InputItem, Toast, WingBlank, WhiteSpace, Flex} from "antd-mobile";
import {jsonToDouble, PhoneFormat} from "../util/StringUtil";
import {auth} from "../util/auth";
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
        const {phone, password} = this.state;
        try {
            const resp = await http.query("","user:"+PhoneFormat(phone));
            if(resp.data && resp.data.result.response.value){
                const user = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                console.log(user)
                if(user.password === password){
                    Toast.info("登陆成功");
                    auth.setUser(user);
                    this.props.history.push("/main");
                }else{
                    Toast.fail("密码错误");
                }
            }else{
                Toast.fail("用户不存在");
            }
        }catch (e) {
            console.log(e);
        }
    }

    render(){
        const {phone, password} = this.state;
        return(
            <div className="login">
                <WingBlank>
                    <div style={{height: 100}}></div>
                    <div className={"name"}>TendermintApp</div>
                    <WhiteSpace size={"xl"}/>
                    <InputItem
                        type={"phone"}
                        clear
                        placeholder={"请输入手机号码"}
                        value={phone}
                        onChange={phone => this.setState({phone})}
                    >
                        <img src={i_phone}  alt={"手机号:"}/>
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
                    <WhiteSpace size={"sm"}/>
                    <Flex justify={"between"} style={{overflow: "visible"}} className={"bottom"}>
                        <div>忘记密码</div>
                        <div onClick={() => this.props.history.push("/register")}>新用户注册</div>
                    </Flex>
                    <WhiteSpace size={"lg"}/>
                    <Button
                        type={"primary"}
                        size={"small"}
                        style={{width: '100%'}}
                        disabled={PhoneFormat(phone).length !== 11 || !password}
                        onClick={() => this.toLogin()}
                    >
                        登录
                    </Button>
                </WingBlank>
            </div>
        )
    }

}