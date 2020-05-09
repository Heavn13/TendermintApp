import "./index.css"
import React from "react";
import {Route} from "react-router";
import {TabBar} from "antd-mobile";
import Home from "./home/index";
import Mine from "./mine/index";
import Transaction from "./transaction";
const i_home = require("../assets/i_home_gray.svg");
const i_home_blue = require("../assets/i_home_blue.svg");
const i_transaction = require("../assets/i_transaction_gray.svg");
const i_transaction_blue = require("../assets/i_transaction_blue.svg");
const i_mine = require("../assets/i_mine_gray.svg");
const i_mine_blue = require("../assets/i_mine_blue.svg");


const tabs = [
    {path: "/main/home", title: "首页", icon: i_home, selectedIcon: i_home_blue},
    {path: "/main/transaction", title: "交易", icon: i_transaction, selectedIcon: i_transaction_blue},
    {path: "/main/mine", title: "我的", icon: i_mine, selectedIcon: i_mine_blue},
];

/**
 * 用户客户端界面
 */
export default class Main extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 0, //底部导航栏 0 首页 1 交易 2 我的
        }

    }

    componentDidMount() {
        // 根据路由匹配底部导航栏索引值
        if(this.props.location.pathname.match("home")) this.setState({tabIndex: 0});
        if(this.props.location.pathname.match("transaction")) this.setState({tabIndex: 1});
        if(this.props.location.pathname.match("mine")) this.setState({tabIndex: 2});
    }

    render(){
        const {tabIndex} = this.state;
        return(
            <div className="main">
                {/*渲染子路由*/}
                <div className="container">
                    <Route exact path={"/main/home"} component={Home}></Route>
                    <Route exact path={"/main/transaction"} component={Transaction}></Route>
                    <Route exact path={"/main/mine"} component={Mine}></Route>
                </div>
                {/*底部导航栏*/}
                <TabBar
                    className="tab-bar"
                    unselectedTintColor="#949494"
                    tintColor="#0e80d2"
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