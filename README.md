This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 修改tendermint配置
 在$TMHOME/config/config.toml文件中，该文件夹处于隐藏状态
 修改以下内容，使得tendermint可以跨域访问
 
 #A list of origins a cross-domain request can be executed from
 #Default value '[]' disables cors support
 #Use '["*"]' to allow any origin
 cors_allowed_origins = ["*"]
 
 #A list of methods the client is allowed to use with cross-domain requests
 cors_allowed_methods = ["HEAD", "GET", "POST", ]
 
 #A list of non simple headers the client is allowed to use with cross-domain requests
 cors_allowed_headers = ["Origin", "Accept", "Content-Type", "X-Requested-With", "X-Server-Time", "Access-Control-Allow-Origin" ]

## tendermint apci参考网址
http://cw.hubwiz.com/card/c/tendermint-rpc-api/

## antd组件参考网址
https://ant.design/components/button-cn/
