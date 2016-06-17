/**
 * Created by Sunday on 2016/6/12.
 * 1, 查看本地存储的token，expire，email，不存在跳登录！
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, AppRegistry, StatusBar, Navigator, ToolbarAndroid, ListView, Image, TouchableOpacity, Linking, ToastAndroid} from 'react-native';
var _ = require("lodash");

import LoginView from "./login";
import AboutView from "./about";
import DevDetailView from "./devdetail";
import ProfileView from "./profileview";
import {user_online_devices} from "./httpapi";
import SmartConfigAndroid from "./smartconfig";
import {constant} from "./constant";



var firmware_type = {
    UNKNOWN: '未知固件',
    AT: 'AT',
    AT_PLUS: 'ESPUSH专属',
    NodeMCU: 'NodeMCU',
    SDK: 'SDK'
};

/*
 devname: '测试板',
 appid: '12345',
 appname: '智能插座',
 appkey: '1234141234123',
 vertype: 'AT_PLUS'
*/
export  default class OnlineDevices extends Component {
    constructor(props) {
        super(props);
        let online = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            onlineDevs: this.ds.cloneWithRows(online),
            actions: [
                {title: '平台登录', icon: require("../resources/images/login.png"), show: 'always', type: 'LOGIN'},
                {title: '开发板', type: 'TAOBAO'},
                {title: '一键配置', type: 'SMARTCONFIG'},
                {title: '关于', type: 'ABOUT'}
            ]
        };
        gl_storage.getUserAuthStorage().then((token) => {
            this.loadOnlineDevices();
        }).catch((err) => {
            ToastAndroid.show('尚未登录，戳右上角登录后获取在线设备列表。', ToastAndroid.SHORT);
        })
    }

    loadOnlineDevices = () => {
        user_online_devices(gl_storage.getTokenObj()).then((devs) => {
            console.info('ONLINE DEVS: ' + JSON.stringify(devs));
            var newState = _.cloneDeep(this.state);
            newState.onlineDevs = this.ds.cloneWithRows(devs);
            var pos = _.findIndex(newState.actions, ['type', 'LOGIN']);
            if(pos !== -1) {
                newState.actions[pos] = {
                    title: '用户信息',
                    icon: require("../resources/images/profile.png"),
                    show: 'always',
                    type: 'PROFILE'
                };
            }
            this.setState(newState);
        }).catch((error) => {
            alert('请求在线设备时发生错误，需要重新登录用户。');
            console.log(error);
            let newState = _.cloneDeep(this.state);
            newState = this.change_ico_profile_login(newState);
            this.setState(newState);
        });
    };

    change_ico_profile_login = (newState) => {
        var pos = _.findIndex(newState.actions, ['type', 'PROFILE']);
        if(pos !== -1) {
            newState.actions[pos] = {
                title: '平台登录',
                icon: require("../resources/images/login.png"),
                show: 'always',
                type: 'LOGIN'
            }
        }
        return newState;
    };

    onDevDetailPress = (devInfo) => {
        const {navigator} = this.props;
        if(!navigator) {
            alert('内部错误！');
            return;
        }

        navigator.push({
            name: 'DevDetailView',
            component: DevDetailView,
            params: {
                devInfo
            }
        });
    };

    renderSingleDevices = (devInfo) => {
        return (
            <TouchableOpacity
                onPress={_.partial(this.onDevDetailPress, devInfo)}
                style={styles.touchableItems}>
                <View style={styles.itemContainer}>
                    <Image
                        style={styles.itemLogo}
                        source={require("../resources/images/onlinedev.png")} />
                    <View style={styles.rightContainer}>
                        <Text style={styles.devName}>{devInfo.devname ? devInfo.devname : devInfo.chipid}</Text>
                        <View style={styles.rightbootomContainer}>
                            <Text style={styles.devType}>{firmware_type[devInfo.vertype]}</Text>
                            <Text style={styles.devInfo}>{devInfo.appname}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    openTaobaoLink = () => {
        var url = 'https://item.taobao.com/item.htm?id=523362788057';
        Linking.canOpenURL(url).then(supported => {
            if(!supported) {
                alert('系统未安装浏览器？');
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => {
            alert('打开系统浏览器出错！')
        });
    };

    jumpToLogin = () => {
        this.props.navigator.push({
            name: 'LoginView',
            component: LoginView,
            params: {
                loginSucc: this.loginSucc
            }
        });
    };

    loginSucc = () => {
        this.loadOnlineDevices();
    };

    jumpToAbout = () => {
        this.props.navigator.push({
            name: 'AboutView',
            component: AboutView
        });
    };

    jumpToSmartConfig = () => {
        SmartConfigAndroid.configActivity();
    };

    onActionSelected = (position) => {
        var evt = this.state.actions[position];
        if(evt.type === 'LOGIN') {
            this.jumpToLogin();
        } else if(evt.type === 'SMARTCONFIG') {
            this.jumpToSmartConfig();
        } else if(evt.type === 'TAOBAO') {
            this.openTaobaoLink();
        } else if(evt.type === 'ABOUT') {
            this.jumpToAbout();
        } else if(evt.type === 'PROFILE') {
            this.jumpToProfile();
        }
    };

    render() {
        return (
            <View>
                <ToolbarAndroid
                    actions={this.state.actions}
                    style={styles.toolbar}
                    subtitle="IoT on ESP8266"
                    titleColor="white"
                    subtitleColor="white"
                    onActionSelected={this.onActionSelected}
                    title="ESPUSH" />
                {
                    this.state.onlineDevs.getRowCount() ?
                        <ListView
                            enableEmptySections={true}
                            style={styles.listview}
                            dataSource={this.state.onlineDevs}
                            renderRow={this.renderSingleDevices} />
                        :
                        <TouchableOpacity
                            onPress={this.refreshOnlineDevices_or_login}
                            style={styles.touchableItems}>
                            <View style={styles.itemContainer}>
                                <View style={styles.rightContainer}>
                                    <Text style={styles.emptyTitle}>{gl_storage.isSignedIn() ? "当前无设备在线，点击刷新。" : "戳右上角登录。"}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                }
            </View>
        );
    }

    jumpToProfile = () => {
        this.props.navigator.push({
            name: 'ProfileView',
            component: ProfileView,
            params: {
                logoutcb: this.logoutcb
            }
        });
    };

    logoutcb = () => {
        let newState = _.cloneDeep(this.state);
        newState = this.change_ico_profile_login(newState);
        newState.onlineDevs = this.ds.cloneWithRows([]);
        this.setState(newState);
    };

    refreshOnlineDevices_or_login = () => {
        if(!gl_storage.isSignedIn()) {
            this.jumpToLogin();
        } else {
            this.loadOnlineDevices();
        }
    };
}

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: constant.navBackgroundColor,
        height: 56
    },
    listview: {
        flex: 1
    },
    touchableItems: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        padding: 5,
        borderColor: '#E1E1E1'
    },
    itemContainer: {
        marginTop: 4,
        marginBottom: 8,
        marginLeft: 8,
        marginRight: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    itemLogo: {
        width: 50,
        height: 50
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 8
    },
    rightbootomContainer: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    devType: {
        //
    },
    devName: {
        fontSize: 16,
        color: 'black'
    },
    emptyTitle: {
        fontSize: 18,
        textAlign: 'center'
    },
    devInfo: {
        alignSelf: 'flex-end'
    },
    emptyDev: {

    }
});
