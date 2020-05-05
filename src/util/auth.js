/**
 * 用户鉴权工具类
 * @author Heavn
 */
import {Modal} from "antd-mobile";

/**
 * 从localstorage中获取用户信息
 * @returns {any}
 */
const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

/**
 * 将用户信息存到localstorage中
 * @param user
 */
const setUser = (user) => {
    if(user) localStorage.setItem("user", JSON.stringify(user));
};

/**
 * 清除用户缓存信息
 */
const removeUser = () => {
    if(localStorage.getItem("user"))
        localStorage.removeItem("user");
};

/**
 * 验证用户是否已登录
 * @param props
 * @returns {boolean}
 */
const checkUser = (props) => {
    if(!localStorage.getItem("user")){
        Modal.alert(
            "提醒",
            "用户未登录，是否前往登录？",
            [
                {text: "前往登录", onPress: () => {
                        props.history.replace("/login");
                    }}
            ]
        );
        return false;
    }else
        return true;
};

/**
 * 方法导出公共类
 * @type {{checkUser: checkUser, removeUser: removeUser, getUser: (function(): any), setUser: setUser}}
 */
export const auth = {
    getUser,
    setUser,
    removeUser,
    checkUser
};
