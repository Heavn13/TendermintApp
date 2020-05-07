import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {Redirect} from "react-router";
import {auth} from "./auth";
import Register from "../register";
import Login from "../login";
import Main from "../main";
import Information from "../main/mine/info";
import Certification from "../main/mine/certification";
import Admin from "../admin";
import Operate from "../admin/operate";
import Manage from "../admin/manage";
import Car from "../admin/manage/car";
import Detail from "../main/home/detail";

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
            {/*车辆详情界面*/}
            <Route exact path="/main/home/detail" render={
                props => {
                    if(auth.checkUser(props))
                        return <Detail {...props}/>
                }
            }/>
            {/*个人信息界面*/}
            <Route exact path="/main/mine/info" render={
                props => {
                    if(auth.checkUser(props))
                        return <Information {...props}/>
                }
            }/>
            {/*实名认证界面*/}
            <Route exact path="/main/mine/cert" render={
                props => {
                    if(auth.checkUser(props))
                        return <Certification {...props}/>
                }
            }/>
            {/*首页界面*/}
            <Route path="/main" render={
                props => {
                    if(auth.checkUser(props))
                        return <Main {...props}/>
                }
            }/>
            {/*系统管理员审核界面*/}
            <Redirect exact from="/admin" to="/admin/authenticate"/>
            {/*系统管理员审核项目操作界面*/}
            <Route exact path="/admin/authenticate/operate" component={Operate}/>
            {/*系统管理员管理车辆信息界面*/}
            <Route exact path="/admin/manage" component={Manage}/>
            {/*系统管理员新增车辆信息界面*/}
            <Route exact path="/admin/manage/car" component={Car}/>
            {/*系统管理员界面*/}
            <Route path="/admin" component={Admin}/>
            {/*默认匹配*/}
            <Route path="/*" component={DefaultRoute}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;