/**
 * Created by Sunday on 2016/6/12.
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, AppRegistry, StatusBar, Navigator, ToolbarAndroid, ListView, Image, TouchableOpacity, WebView} from 'react-native';
import {constant} from "./constant";

var _ = require("lodash");


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
                    source={require("../resources/about/about.html")} />
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
