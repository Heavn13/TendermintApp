import "./index.css"
import React from "react";
import {
    Icon,
    NavBar,
    PullToRefresh, Toast,
    WhiteSpace,
} from "antd-mobile";
import CarItem from "../../components/CarItem";
import http from "../../util/http";
import {jsonToDouble} from "../../util/StringUtil";
import {decodeBase64} from "../../util/decode";
import {ipfs} from "../../util/ipfs";
const i_new = require("../../assets/i_new.svg");

export default class Manage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            carInfos: [],
            refreshing: false
        }
    }

    componentDidMount() {
        this.getData();
    }

    /**
     * 获取参与/发起的项目数据
     * @returns {Promise<void>}
     */
    getData = async () => {
        try {
            const resp = await http.query("car","");
            if(resp.data && resp.data.result.response.value){
                const carInfos = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                console.log(carInfos);
                // 获取图片
                for(const carInfo of carInfos){
                    const result = await ipfs.get(carInfo.picture);
                    carInfo.url = result;
                }
                this.setState({carInfos: carInfos});
            }else{
                Toast.fail("数据不存在");
            }
        }catch (e) {
            console.log(e);
        }
    };

    /**
     * 跳转至管理项目界面
     * @param type 项目类型
     * @param project 项目信息
     */
    jumpToManage = (carInfo) => {
        const state = {
            type: 1,
            carInfo: carInfo
        };
        this.props.history.push({pathname: "/admin/manage/car", state})
    };

    render(){
        const {carInfos, refreshing} = this.state;
        return(
            <div className="project">
                {/*导航栏*/}
                <NavBar
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    车辆租赁信息管理
                </NavBar>
                <WhiteSpace size={"md"}/>
                {/*上拉刷新*/}
                <PullToRefresh
                    damping={40}
                    style={{
                        width: '100%',
                        overflow: 'auto'
                    }}
                    indicator={{ activate: '松开立即刷新' }}
                    direction={'down'}
                    refreshing={refreshing}
                    onRefresh={() => this.getData()}
                >
                    <div className="carList">
                        {carInfos.length > 0 ? carInfos.map((item, index) => {
                            return(
                                <CarItem key={index} carInfo={item} onItemClick={() => this.jumpToManage(item)}/>
                            )
                        }): null}
                        <WhiteSpace size={"xl"}/>
                        <WhiteSpace size={"xl"}/>
                        <WhiteSpace size={"xl"}/>
                    </div>
                </PullToRefresh>

                {/*新增按钮*/}
                <img onClick={() => this.props.history.push({pathname: "/admin/manage/car", state: {type: 0}})} className="new" src={i_new} alt={"新增"}/>
            </div>
        )
    }
}