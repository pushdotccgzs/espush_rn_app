/**
 * Created by Sunday on 2016/6/12.
 */

import React, {Component} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ToolbarAndroid, Linking} from 'react-native';
import {constant} from "./constant";
import {login} from "./httpapi";
var Dimensions = require("Dimensions");
var _ = require("lodash");


export default class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    loginSucc = () => {
        if(this.props.loginSucc) {
            this.props.loginSucc();
        }
    };

    backToMain = () => {
        this.props.navigator.pop();
    };

    loginBtnPress = () => {
        if(!this.state.email || !this.state.password) {
            return alert('请填入完整登录信息。');
        }
        let req = login(this.state.email, this.state.password);
        req.then((token) => {
            gl_storage.setTokenObj(token);
            console.log('登录成功！');
            this.loginSucc();
            this.backToMain();
        }).catch((err) => {
            console.error('登录失败！');
            alert('登陆时发生错误，请稍后重试！');
        });
    };

    registerBtnPress = () => {
        var url = 'https://espush.cn/webv2/register/';
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

    render() {
        return (
            <View style={styles.rootContainer}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    navIcon={require("../resources/images/back.png")}
                    titleColor="white"
                    onIconClicked={this.backToMain}
                    title="登录" />

                <Text style={styles.titleText}>ESPUSH 账户登录</Text>
                <View style={[styles.formContainer, {width: Dimensions.get('window').width - 80}]}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            maxLength={32}
                            onChangeText={(text) => this.setState(_.assign(this.state, {email: text}))}
                            keyboardType="email-address"
                            placeholder="登录邮箱"
                            style={styles.textInput} />
                        <Image style={styles.rightImage} />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            onChangeText={(text) => this.setState(_.assign(this.state, {password: text}))}
                            maxLength={32}
                            secureTextEntry={true}
                            password={true}
                            placeholder="密码"
                            style={styles.textInput} />
                        <Image style={styles.rightImage} />
                    </View>
                    <View style={styles.loginRegisterContainer}>
                        <TouchableOpacity style={styles.btnStyle} onPress={this.loginBtnPress}>
                            <Text style={styles.btnText}>登录</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnStyle} onPress={this.registerBtnPress}>
                            <Text style={styles.btnText}>前往注册</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    toolbar: {
        height: 48,
        backgroundColor: constant.navBackgroundColor
    },
    titleText: {
        alignSelf: 'center',
        fontSize: 22,
        marginTop: 40,
        color: 'black'
    },
    formContainer: {
        // backgroundColor:"white",
        marginLeft: 40,
        marginTop: 28
    },
    inputContainer: {
        //
    },
    textInput: {
        //
    },
    rightImage: {
        //
    },
    btnStyle: {
        marginTop: 28,
        alignSelf: 'center',
        width: 100,
        height: 50,
        backgroundColor: constant.navBackgroundColor,
        borderRadius: 25,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    btnText: {
        fontSize: 18,
        alignSelf: 'center',
        color: 'white'
    },
    loginRegisterContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
