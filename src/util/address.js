import axios from "axios";

/**
 * 百度api默认请求实例
 * 编码为charset=UTF-8
 */
let instance = axios.create({
    baseURL: 'http://api.map.baidu.com/reverse_geocoding/v3',
    timeout: 5000,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
});

let address = {};

address.lonLatToLocation = (data) => {
    return new Promise((resolve, reject) => {
        try {
            instance.get(`/?ak=eG3yfD2DYtzzA6LpFoCU05yV49S0U0bo&output=json&coordtype=wgs84ll&location=${data[1]},${data[0]}`).then(
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

export default address;