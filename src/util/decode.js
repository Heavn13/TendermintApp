/**
 * 解码base64
 * @param base64
 * @returns {string}
 */
export const decodeBase64 = (base64) => {
    return new Buffer(base64, 'base64').toString();
}