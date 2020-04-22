/**
 * axios网络请求工具类
 * @author Heavn
 */
import axios from "axios";

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
    sendTransaction: (key, data) => {}
};

/**
 * 发起交易
 * @param key
 * @param data
 * @returns {Promise<unknown>}
 */
http.sendTransaction = (key, data) => {
    const params = JSON.stringify(data).replace(/"/g,"'");
    console.log(params);
    return new Promise((resolve, reject) => {
        try {
            instance.get(`/broadcast_tx_async?tx="${key}=${params}"`).then(
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