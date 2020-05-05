import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {Redirect} from "react-router";
import {auth} from "./auth";
import Register from "../register";
import Login from "../login";
import Main from "../main";
import Information from "../main/mine/info";

const DefaultRoute = () => (
    <div>No match</div>
);

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            {/*//定义路由地址*/}
            {/*登录界面*/}
            <Redirect exact from="/" to="/login" />
            {/*登录界面*/}
            <Route exact path="/login" component={Login}/>
            {/*注册界面*/}
            <Route exact path="/register" component={Register}/>
            {/*首页界面*/}
            <Redirect exact from="/main" to="/main/home" />
            {/*实名认证界面*/}
            <Route exact path="/main/mine/info" render={
                props => {
                    if(auth.checkUser(props))
                        return <Information {...props}/>
                }
            }/>
            {/*首页界面*/}
            <Route path="/main" render={
                props => {
                    if(auth.checkUser(props))
                        return <Main {...props}/>
                }
            }/>
            {/*默认匹配*/}
            <Route path="/*" component={DefaultRoute}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;