
/**
 * 手机号去除多余空白字符
 * @param phone
 * @returns {string}
 */
export const PhoneFormat = (phone) => {
    return phone.replace(/\s+/g,"");
};