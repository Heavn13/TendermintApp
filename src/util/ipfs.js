/**
 * ipfs文件存储工具类
 * @author Heavn
 */
import {Toast} from "antd-mobile";

const ipfsClient = require('ipfs-http-client');


/**
 * ipfs实例
 */
const instance = ipfsClient({
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http',
    // 此处不能添加该请求头 而是要在ipfs端设置以下内容
    // ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin ‘["*"]’
    // ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods ‘["PUT", "POST", "GET"]’
    // 不允许以下
    // headers: {
    //     'Access-Control-Allow-Origin': '*'
    // }
});

/**
 *  将文件添加到ipfs中
 * @param file
 * @returns {Promise<unknown>}
 */
const add = (file) =>{
    return new Promise(async (resolve,reject)=>{
        try{
            for await (const result of instance.add(file)) {
                resolve(result.path);
            }
        }catch (e) {
            Toast.fail(e.toString(), 3);
            reject(e);
        }
    })
}

/**
 * 获取ipfs当中的文件，此处今为base64文件编码
 * @param hash
 * @returns {Promise<unknown>}
 */
const get = (hash) => {
    return new Promise(async (resolve,reject)=>{
        try{
            for await (const file of instance.get(hash)) {
                //此处buffer拼接尚有一些问题，但是Base64编码都为英语，因此此处不会出错
                let buffer = "";
                for await (const chunk of file.content) {
                    buffer += chunk;
                }
                resolve(buffer.toString());
            }
        }catch (e){
            Toast.fail(e.toString(), 3);
            reject(e);
        }
    });
};

export const ipfs = {
    add,
    get
};