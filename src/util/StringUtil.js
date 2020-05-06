
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