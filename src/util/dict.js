/**
 * 用户默认值
 */
export const defaultUser = {
    phone: "",
    nickname: "",
    picture: "",
    birthday: 0,
    mail: "",
    password: "",
    isCert: false,
    isAudit: false,
    certInfo: {
        name: "",
        sex: 0,
        id: "",
        idAddress: "",
        picture1: "",
        picture2: "",
        picture3: "",
        time: 0
    },
    time: 0
};

/**
 * 性别默认值
 */
export const sex = [
    {value: 0, label: "男"},
    {value: 1, label: "女"},
    {value: 2, label: "未知"}
];