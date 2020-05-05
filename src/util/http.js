/**
 * axios网络请求工具类
 * @author Heavn
 */
import axios from "axios";
import {jsonToSingle} from "./StringUtil";

/**
 * axios默认请求实例
 * 编码为charset=UTF-8
 */
let instance = axios.create({
    baseURL: 'http://127.0.0.1:26657',
    timeout: 5000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8' //需要使用application/json
    }
});

let http = {
    sendTransactionByAdd: (key, data) => {}
};

/**
 * 发起交易, 新增
 * @param key
 * @param data
 * @returns {Promise<unknown>}
 */
http.sendTransactionByAdd = (key, data) => {
    const params = jsonToSingle(JSON.stringify(data));
    console.log(params);
    return new Promise((resolve, reject) => {
        try {
            instance.get(`/broadcast_tx_async?tx="add=${key}=${params}"`).then(
                success => {
                    resolve(success);
                },
                fail => {
                    reject(fail);
                });
        }catch (e) {
            reject(e);
        }
    })
};

/**
 * 发起交易, 修改
 * @param key
 * @param data
 * @returns {Promise<unknown>}
 */
http.sendTransactionByModify = (key, data) => {
    const params = jsonToSingle(JSON.stringify(data));
    console.log(params);
    return new Promise((resolve, reject) => {
        try {
            instance.get(`/broadcast_tx_async?tx="modify=${key}=${params}"`).then(
                success => {
                    resolve(success);
                },
                fail => {
                    reject(fail);
                });
        }catch (e) {
            reject(e);
        }
    })
};

/**
 * 发起交易, 删除
 * @param key
 * @param data
 * @returns {Promise<unknown>}
 */
http.sendTransactionByDelete = (key) => {
    return new Promise((resolve, reject) => {
        try {
            instance.get(`/broadcast_tx_async?tx="delete=${key}="`).then(
                success => {
                    resolve(success);
                },
                fail => {
                    reject(fail);
                });
        }catch (e) {
            reject(e);
        }
    })
};

/**
 * 获取数据
 * @param data key值
 * @returns {Promise<unknown>}
 */
http.query = (data) => {
    return new Promise((resolve, reject) => {
        try {
            instance.get(`/abci_query?data="${data}"`).then(
                success => {
                    resolve(success);
                },
                fail => {
                    reject(fail);
                });
        }catch (e) {
            reject(e);
        }
    })
};

export default http;