/**
 * Created by Sunday on 2016/6/12.
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, AppRegistry, StatusBar, Navigator, ToolbarAndroid, ListView, Image, TouchableOpacity, WebView} from 'react-native';
import {constant} from "./constant";

var _ = require("lodash");


var about_html = `
<!doctype html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h2>关于蘑菇云平台</h2>
    <p>蘑菇云（https://espush.cn/），是针对ESP8266 WIFI芯片研发的云开发平台，致力于提供最稳定、最易用的物联网云开发平台。</p>
    <p>使用蘑菇云固件或SDK，能最快的时间内获得稳定可靠的云端控制能力。同时，蘑菇云还针对数据、传感器类应用提供可靠的基础设施如固件、服务端接口API、示例App等。使用蘑菇云搭配的ESP8266芯片能大大提高物联网基础设备开发效率。</p>
    <h4>如何使用?</h4>
    <p>教程在这里：http://docs.espush.cn/.</p>
    <p>尝试在10分钟内做一个智能插座：http://blog.espush.cn/ten_minute_socket.html.</p>
    <p>数据采集，绘图的例子：温度传感器：http://blog.espush.cn/ten_minute_humiture_sensor.html数据在离线时还能缓存哦。</p>
    <h2>关于蘑菇云开发板</h2>
    <p>蘑菇云平台功能测试板，板载LED、三色彩灯、 DHT11温湿度传感器、ST188红外光电传感器、继电器、控制按钮等，覆盖常见物联网开发应用场景如智能插座、红外远程告警、智能彩灯、云端温度曲线等。搭配蘑菇云专属固件与控制App，以及随附的教程资料，让你的物联网开发过程事半功倍。</p>
    <h2>获取支持</h2>
    <p>加入<a href="http://shang.qq.com/wpa/qunwpa?idkey=c5f0d4bbb717db6b9b53d716adee7cc0826ce1152b7ad668daec2744a5730507">Q群480288089</a>，一起讨论。</p>
    <p>关注公众号espush，可微信远控设备。</p>
    <p>商务合作请联系 webmaster@espush.cn </p>
</body>
</html>
`;


export default class AboutView extends Component {
    constructor(props) {
        super(props);
    }

    onIconClicked = () => {
        const {navigator} = this.props;
        if(!navigator) {
            alert('内部错误！');
            return;
        }
        navigator.pop();
    };
    render() {
        return (
            <View style={styles.rootContainer}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    navIcon={require("../resources/images/back.png")}
                    titleColor="white"
                    onIconClicked={this.onIconClicked}
                    title="关于" />
                <WebView
                    style={styles.webview}
                    source={{html: about_html}} />
            </View>
        );
    }
}
var BGWASH = 'rgba(255,255,255,0.8)';

styles = StyleSheet.create({
    rootContainer: {
        flexDirection: 'column',
        flex: 1
    },
    toolbar: {
        height: 48,
        backgroundColor: constant.navBackgroundColor
    },
    webview: {
        backgroundColor: BGWASH
    }
});
