import React from "react";
import {
    Button,
    Flex,
    Icon,
    ImagePicker,
    InputItem,
    List, Modal,
    NavBar,
    Picker, Toast,
    WhiteSpace,
    WingBlank
} from "antd-mobile";
import {auth} from "../../util/auth";
import BasicInfo ,{mask} from "../../components/BasicInfo";
import http from "../../util/http";
import {defaultUser, sex} from "../../util/dict";
import {ipfs} from "../../util/ipfs";


/**
 * 实名认证信息
 */
export default class Certification extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            user: defaultUser,
            pictures: [],
            status: 0
        }
    }

    componentDidMount() {
        this.setState({user: auth.getUser()}, () => this.beforeAuthenticate());
    }

    /**
     * 初始校验
     */
    beforeAuthenticate = async () => {
        const {user, pictures} = this.state;
        try{
            if(user.isAudit){
                Modal.alert(
                    "提醒",
                    "您的实名认证正等待审核中，请稍候查看结果。",
                    [
                        {text: "知道了", onPress: () => this.props.history.goBack()}
                    ]
                )
            }else{
                if(user.certInfo.picture1 && user.certInfo.picture2 && user.certInfo.picture3){
                    const picture1 = await ipfs.get(user.certInfo.picture1);
                    pictures.push({url: picture1});
                    const picture2 = await ipfs.get(user.certInfo.picture2);
                    pictures.push({url: picture2});
                    const picture3 = await ipfs.get(user.certInfo.picture3);
                    pictures.push({url: picture3});
                    this.setState({pictures});
                }
                if(user.isCert) this.setState({status: 2})
            }
        }catch (e) {
            console.log(e);
        }
    };

    // 提交认证
    toAuthenticate = async () => {
        const {user, pictures} = this.state;
        if(user.certInfo.id === "" || !user.certInfo.idAddress || !user.certInfo.name){
            Toast.info("请将身份证信息填写完整！");
            return ;
        }
        if(pictures.length !== 3){
            Toast.info("请按照要求提交三张身份证件照！");
            return ;
        }
        try{
            Toast.loading("正在提交信息中...",0);
            const picture1 = await ipfs.add(pictures[0].url);
            const picture2 = await ipfs.add(pictures[1].url);
            const picture3 = await ipfs.add(pictures[2].url);

            const tempCertInfo = {
                name: user.certInfo.name,
                sex: user.certInfo.sex,
                id: user.certInfo.id,
                idAddress: user.certInfo.idAddress,
                picture1: picture1,
                picture2: picture2,
                picture3: picture3,
                time: Date.now()
            };
            const tempUser = {
                ...user,
                isAudit: true,
                certInfo: tempCertInfo
            }
            const resp = await http.sendTransactionByModify("user:"+user.phone, tempUser);
            if(resp.data && resp.data.error){
                Toast.fail("提交实名认证信息失败", 2);
            }else{
                Toast.success("提交实名认证信息成功", 2);
                console.log(resp.data.result.hash);
            }
        }catch (e) {
            console.log(e);
            Toast.hide();
        }
    };

    /**
     * 修改值的公共方法
     * @param key
     * @param value
     */
    modifyValue = (key, value) => {
        const newValue = {
            [key]: value
        };
        this.setState({user: {...this.state.user, certInfo: {...this.state.user.certInfo, ...newValue}}});
    };

    render(){
        const {user, pictures, status} = this.state;
        if(user === null) return <div>No Data</div>;
        return(
            <div className="person">
                {/*导航栏*/}
                <NavBar
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                    rightContent={<span onClick={() => this.toAuthenticate()}>{status === 2 ? "重新认证" : "认证"}</span>}
                >
                    实名认证
                </NavBar>
                {/*基本信息*/}
                <BasicInfo user={user}/>
                {/*身份证信息*/}
                <List renderHeader={<div>身份证信息{mask}</div>}>
                </List>
                <div className="idcard" >
                    <Flex justify={"between"}>
                        <Flex.Item flex={"1"}>
                            <InputItem
                                type={"text"}
                                maxLength={6}
                                value={user.certInfo.name}
                                onChange={value => this.modifyValue("name", value)}
                            >
                                姓名{mask}：
                            </InputItem>
                        </Flex.Item>
                        <Flex.Item flex={"1"}>
                            <Picker
                                data={sex}
                                value={[user.certInfo.sex]}
                                cols={1}
                                onChange={value => this.modifyValue("sex", value ? value[0] : sex[0].value)}
                            >
                                <List.Item arrow="horizontal">性别{mask}：</List.Item>
                            </Picker>
                        </Flex.Item>
                    </Flex>
                    <InputItem
                        type={"text"}
                        clear
                        value={user.certInfo.idAddress}
                        onChange={value => this.modifyValue("idAddress", value)}
                    >
                        地址{mask}：
                    </InputItem>
                    <InputItem
                        type={"number"}
                        maxLength={18}
                        value={user.certInfo.id.toString()}
                        clear
                        onChange={value => this.modifyValue("id", value)}
                    >
                        身份证号{mask}：
                    </InputItem>
                </div>
                <WhiteSpace size={"md"}/>
                <WingBlank>
                    <Button
                        size={"small"}
                        type={"ghost"}
                    >读取身份证</Button>
                </WingBlank>
                {/*身份证件照*/}
                <List renderHeader={<div>认证材料{mask}</div>}>
                    <WingBlank className="pictures">
                        {status !== 2 && pictures.length === 0 ? <div>请选择身份证正面照(人像){mask}</div> : null}
                        {status !== 2 && pictures.length === 1 ? <div>请选择身份证反面照(国徽){mask}</div> : null}
                        {status !== 2 && pictures.length === 2 ? <div>请选择手持身份证件照{mask}</div> : null}
                        <WhiteSpace size={"sm"}/>
                        <ImagePicker
                            files={pictures}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            length={3}
                            onChange={(files, type, index) => {
                                this.setState({
                                    pictures: files,
                                });
                            }}
                            selectable={pictures.length < 3}
                        />
                        {status === 2 ? (
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
                        ) : null}
                        <WhiteSpace size={"md"}/>
                    </WingBlank>
                </List>
                <WhiteSpace size={"xl"}/>
            </div>
        )
    }
}