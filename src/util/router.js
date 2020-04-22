import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {Redirect} from "react-router";
import Register from "../register";
import Login from "../login";

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
            {/*默认匹配*/}
            <Route path="/*" component={DefaultRoute}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;