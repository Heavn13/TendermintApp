
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