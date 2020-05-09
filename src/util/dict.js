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

export const defaultCarInfo = {
    id: 0, //商品id
    name: "", //商品名称
    picture: "", //商品图片
    url: "", //图片base64值
    brand: "", //品牌
    transmissionCase: 0, //变速箱 0自动 1手动
    tankCapacity: 0, //油箱容量
    displacement: 0, //排量
    consumption: 0, //百公里消耗
    seats: 0, //座位数
    inlet: 0, //进气 0自然进气 1涡轮增压
    parkingSensor: 0, //倒车雷达 0有 1无
    rentFee: 0, //日均租费
    time: 0, //车辆信息创建时间
}

export const defaultTransaction = {
    orderId: 0, //订单号
    carId: 0, //商品id
    carName: "", //商品名称
    userPhone: "", //用户手机号
    begin: Date.now(), //租赁开始时间
    end: Date.now(), //租赁结束时间
    rentDays: 0, //租赁天数
    totalFee: 0, //租赁总费用
    gpsData: "", //GPS数据
    isPaid: false, //订单是否付款
    isComplete: false, //订单是否完成
    time: 0, //交易创建时间
}