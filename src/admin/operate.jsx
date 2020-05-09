import React from "react";
import {
    Button,
    Flex,
    Icon,
    List,
    NavBar,
    InputItem,
    Picker,
    WhiteSpace,
    WingBlank,
    ImagePicker, Toast
} from "antd-mobile";
import BasicInfo from "../components/BasicInfo";
import {defaultUser, sex} from "../util/dict";
import {ipfs} from "../util/ipfs";
import http from "../util/http";

/**
 * 实名认证信息审核操作界面
 */
export default class Operate extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            user: defaultUser, //用户信息
            pictures: [] //照片
        }
    };

    componentDidMount() {
        const params = this.props.history.location.state;
        // 从路由中获取数据
        if(params)
            this.setState({
                user: params.user
            }, () => this.getPicture());
    };

    /**
     * 从ipfs中获取身份证件照
     * @returns {Promise<void>}
     */
    getPicture = async () => {
        const {pictures, user} = this.state;
        try{
            const picture1 = await ipfs.get(user.certInfo.picture1);
            pictures.push({url: picture1});
            const picture2 = await ipfs.get(user.certInfo.picture2);
            pictures.push({url: picture2});
            const picture3 = await ipfs.get(user.certInfo.picture3);
            pictures.push({url: picture3});
            this.setState({pictures});
        }catch (e) {
            console.log(e);
        }
    };

    /**
     * 审核操作
     * @param agree 是否审核通过
     * @returns {Promise<void>}
     */
    audit = async (agree) => {
        const {user} = this.state;
        try {
            Toast.loading("正在进行审核操作中...",0);
            // 用户信息
            const temp = {
                ...user,
                isCert: agree,
                isAudit: false
            }
            const resp = await http.sendTransactionByModify("user:"+user.phone, temp);
            if(resp.data && resp.data.error){
                Toast.fail("审核操作失败", 2);
            }else{
                Toast.success("审核操作成功", 2);
                console.log(resp.data.result.hash);
                setTimeout(() => {
                    Toast.hide();
                    this.props.history.goBack();
                }, 2000);
            }
        }catch (e) {
            console.log(e);
        }

    };

    render() {
        const {user, pictures} = this.state;
        return (
            <div className="operate">
                {/*导航栏*/}
                <NavBar
                    style={{
                        width: '100%',
                        position: 'fixed',
                        zIndex: 1
                    }}
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    实名认证审核
                </NavBar>
                <WhiteSpace size={"xl"}/>
                <WhiteSpace size={"xl"}/>
                {/*基本信息*/}
                <BasicInfo user={user}/>
                <div className="person">
                    <List renderHeader={<div>身份证信息</div>}>
                    </List>
                    <div className="idcard" >
                        <Flex justify={"between"}>
                            <Flex.Item flex={"1"}>
                                <InputItem
                                    type={"text"}
                                    maxLength={6}
                                    editable={false}
                                    value={user.certInfo.name}
                                >
                                    姓名：
                                </InputItem>
                            </Flex.Item>
                            <Flex.Item flex={"1"}>
                                <Picker
                                    data={sex}
                                    value={[user.certInfo.sex]}
                                    cols={1}
                                >
                                    <List.Item arrow="horizontal">性别：</List.Item>
                                </Picker>
                            </Flex.Item>
                        </Flex>
                        <InputItem
                            type={"text"}
                            clear
                            editable={false}
                            value={user.certInfo.idAddress}
                        >
                            地址：
                        </InputItem>
                        <InputItem
                            type={"number"}
                            maxLength={18}
                            editable={false}
                            value={user.certInfo.id.toString()}
                        >
                            身份证号：
                        </InputItem>
                    </div>
                    <WhiteSpace size={"md"}/>
                    <List renderHeader={<div>认证材料</div>}>
                        <WingBlank className="pictures">
                            <ImagePicker
                                files={pictures}
                                length={3}
                                disableDelete={false}
                                selectable={pictures.length < 3}
                            />
                            <Flex justify={"between"}>
                                <Flex.Item flex={"1"}>
                                    <div className="title">身份证正面照<br/>(国徽)</div>
                                </Flex.Item>
                                <Flex.Item flex={"1"}>
                                    <div className="title">身份证反面照<br/>(人像)</div>
                                </Flex.Item>
                                <Flex.Item flex={"1"}>
                                    <div className="title">手持身份证件照</div>
                                </Flex.Item>
                            </Flex>
                        </WingBlank>
                        <WhiteSpace size={"md"}/>
                    </List>
                </div>
                <WhiteSpace size={"lg"}/>
                {/*审核操作按钮组*/}
                <WingBlank>
                    <Flex justify={"between"}>
                        <Flex.Item flex={"1"}>
                            <Button
                                type={"ghost"}
                                size={"small"}
                                onClick={() => this.audit(false)}
                            >
                                拒绝
                            </Button>
                        </Flex.Item>
                        <Flex.Item flex={"1"}>
                            <Button
                                type={"primary"}
                                size={"small"}
                                onClick={() => this.audit(true)}
                            >
                                通过
                            </Button>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
                <WhiteSpace size={"xl"}/>
            </div>
        )
    }
}