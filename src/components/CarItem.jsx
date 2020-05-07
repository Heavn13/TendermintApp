import "./common.css"
import React from "react";
import {Flex} from "antd-mobile";
import {timeStampToDateTime} from "../util/StringUtil";
const i_nopicture = require("../assets/i_nopicture.svg");

/**
 * 用户基本信息组件
 * @param user
 * @constructor
 */
export default class CarItem extends React.Component {
    render() {
        const {carInfo, onItemClick} = this.props
        return(
            <div className="carItem" onClick={() => onItemClick(carInfo)}>
                <Flex>
                    <Flex.Item style={{flex: 3}}>
                        <img src={carInfo.url ? carInfo.url : i_nopicture} alt={"图片"}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: 4}}>
                        <div className="content">
                            <div className="name">{carInfo.name}<span className="brand">{carInfo.brand}</span></div>
                            <div className="rentFee">日均费用：<span className="fee">{carInfo.rentFee}</span> 元</div>
                            <div className="time">{timeStampToDateTime(carInfo.time)}</div>
                        </div>
                    </Flex.Item>
                </Flex>
            </div>
        )
    }
};