import "./index.css"
import React from "react";
import {Route} from "react-router";
import {TabBar} from "antd-mobile";
import Setting from "./setting";
import Authenticate from "./authenticate";
const i_cert = require("../assets/i_cert_gray.svg");
const i_cert_red = require("../assets/i_cert_red.svg");
const i_setting = require("../assets/i_setting_gray.svg");
const i_setting_red = require("../assets/i_setting_red.svg");


const tabs = [
    {path: "/admin/authenticate", title: "审核", icon: i_cert, selectedIcon: i_cert_red },
    {path: "/admin/setting", title: "系统设置", icon: i_setting, selectedIcon: i_setting_red },
];

/**
 * 管理员客户端界面
 */
export default class Admin extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 0,
        }

    }

    componentDidMount() {
        // 根据路由匹配底部导航栏索引值
        if(this.props.location.pathname.match("authenticate")) this.setState({tabIndex: 0});
        if(this.props.location.pathname.match("setting")) this.setState({tabIndex: 1});
    }

    render(){
        const {tabIndex} = this.state;
        return(
            <div className="admin">
                {/*渲染子路由*/}
                <div className="container">
                    <Route exact path={"/admin/authenticate"} component={Authenticate}></Route>
                    <Route exact path={"/admin/setting"} component={Setting}></Route>
                </div>
                {/*底部导航栏*/}
                <TabBar
                    className="tab-bar"
                    unselectedTintColor="#949494"
                    tintColor="#f4333c"
                    barTintColor="white"
                    tabBarPosition="bottom"
                >
                    {tabs.map((item, index) => {
                        return(
                            <TabBar.Item
                                title={item.title}
                                key={index}
                                icon={<img src={item.icon} alt={item.title}/>}
                                selectedIcon={<img src={item.selectedIcon} alt={item.title}/>}
                                selected={tabIndex === index}
                                onPress={() => {
                                    this.setState({tabIndex: index});
                                    this.props.history.replace(item.path);
                                }}
                            />
                        )
                    })}
                </TabBar>
            </div>
        )
    }
}