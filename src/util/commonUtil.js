
/**
 * 手机号去除多余空白字符
 * @param phone
 * @returns {string}
 */
export const PhoneFormat = (phone) => {
    return phone.replace(/\s+/g,"");
};

/**
 * json字符串中的"改成',否则tendermint无法识别
 * @param str
 * @returns {*}
 */
export const jsonToSingle = (str) => {
    return str.replace(/"/g,"'");
}

/**
 * json字符串中的‘改成“,否则JSON.parse()无法解析
 * @param str
 * @returns {*}
 */
export const jsonToDouble = (str) => {
    return str.replace(/'/g,'"');
}

/**
 * 时间戳转化成日期时间
 * @param time
 * @returns {string}
 */
export const timeStampToDateTime = (time) => {
    return new Date(time).toLocaleString();
};

/**
 * 时间戳转化成日期
 * @param time
 * @returns {string}
 */
export const timeStampToDate = (time) => {
    return new Date(time).toLocaleDateString();
};

/**
 * 毫秒转化成天数
 * @param time
 * @returns {string}
 */
export const millSecondsToDays = (time) => {
    return (time / (1000*60*60*24)).toFixed(0);
};

/**
 * 随机车辆id
 * @returns {number}
 */
export const randCarId = () => {
    return Number(Math.floor(Math.random()*1000).toString() + Date.now().toString())
}

/**
 * 随机交易id
 * @returns {number}
 */
export const randOrderId = () => {
    return Number(Math.floor(Math.random()*100000).toString() + Date.now().toString())
}