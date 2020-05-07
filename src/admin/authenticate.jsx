import React from "react";
import {NavBar, PullToRefresh, Toast, WhiteSpace} from "antd-mobile";
import {jsonToDouble, timeStampToDateTime} from "../util/StringUtil";
import http from "../util/http";
import {decodeBase64} from "../util/decode";

/**
 * 审核实名认证信息与组织认证信息列表界面
 */
export default class Authenticate extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            certInfos: [], // 身份证信息数组
            refreshing: false //下拉刷新状态
        }
    }

    componentDidMount() {
        this.getCertInfo();
    }

    /**
     * 获取所有实名认证信息
     * @returns {Promise<void>}
     */
    getCertInfo = async () => {
        try {
            const resp = await http.query("user","");
            if(resp.data && resp.data.result.response.value){
                const certInfos = JSON.parse(jsonToDouble(decodeBase64(resp.data.result.response.value)));
                console.log(certInfos)
                this.setState({certInfos: certInfos});
            }else{
                Toast.fail("数据不存在");
            }
        }catch (e) {
            console.log(e);
        }
    };

    /**
     * 跳转到审核页面
     * @param item 类型为Certnfo
     * @returns {Promise<void>}
     */
    jumpToAuthenticate = (item) => {
        const params = {
            user: item,
        };
        this.props.history.push({
            pathname: "/admin/authenticate/operate",
            state: params
        })
    };

    render(){
        const {certInfos, refreshing} = this.state;
        return(
            <div className="authenticate">
                {/*导航栏*/}
                <NavBar>实名认证信息</NavBar>
                {/*上拉刷新*/}
                <PullToRefresh
                    damping={40}
                    style={{
                        width: '100%',
                        overflow: 'auto',
                    }}
                    indicator={{ activate: '松开立即刷新' }}
                    direction={'down'}
                    refreshing={refreshing}
                    onRefresh={() => this.getCertInfo()}
                >
                    {/*渲染实名认证信息*/}
                    <div className="userList">
                        {certInfos.length > 0 ? certInfos.map((item, index) => {
                            return <CertItem key={index} info={item} jump={item => this.jumpToAuthenticate(item)}/>
                        }): null}
                        <WhiteSpace size={"xl"}/>
                        <WhiteSpace size={"xl"}/>
                        <WhiteSpace size={"xl"}/>
                    </div>
                </PullToRefresh>
            </div>
        )
    }
}

/**
 * 实名认证信息组件
 * @param info 实名认证信息
 * @param jump 跳转函数
 * @returns {*}
 * @constructor
 */
const CertItem= ({info,jump}) => {
    return(
        <div className="certItem">
            <div>用户手机号：<span className="phone">{info.phone}</span></div>
            <div className="small">发起时间：{timeStampToDateTime(info.certInfo.time)}</div>
            <div className="small">
                当前状态：{
                info.isCert ? <span className="success">审核通过</span> : (info.isAudit ?
                    <span className="wait">等待审核</span>: <span className="fail">审核不通过</span>)
            }</div>
            <div className="view" onClick={() => jump(info)}>查看详情>></div>
        </div>
    )
};