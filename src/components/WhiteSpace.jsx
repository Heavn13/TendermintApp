import React from "react";

/**
 * 空白行
 */
export default class WhiteSpace extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            ratio: 1
        }
    }

    componentDidMount() {
        switch (this.props.size) {
            case "small":
                this.setState({ratio: 1});
                break;
            case "middle":
                this.setState({ratio: 2});
                break
            case "large":
                this.setState({ratio: 3});
                break
            default:
                break;
        }
    }

    render() {
        const {ratio} = this.state
        return(
            <div style={{height: 10 * ratio}}>
            </div>
        )
    }
}