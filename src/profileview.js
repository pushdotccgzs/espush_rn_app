/**
 * Created by Sunday on 2016/6/14.
 */


import React, {Component} from 'react';
import {View, Text, StyleSheet, AppRegistry, StatusBar, Navigator, ToolbarAndroid, ListView, Image, TouchableOpacity, Linking, ToastAndroid} from 'react-native';
var _ = require("lodash");

import {user_apps} from "./httpapi";


import {constant} from "./constant";


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    toolbar: {
        height: 48,
        backgroundColor: constant.navBackgroundColor
    },
    applist: {
        //
    },
    applistParentContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        padding: 5,
        borderColor: '#E1E1E1'
    },
    appname: {
        color: 'black',
        fontSize: 16,
        marginLeft: 12,
        marginTop: 8
    },
    appid: {
        marginRight: 12,
        marginTop: 22
    },
    appsSection: {
        marginLeft: 12,
        marginTop: 18,
        color: 'black',
        fontSize: 18
    }
});

export default class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            apps: this.ds.cloneWithRows([]),
            actions: [
                {title: '开发板', icon: require("../resources/images/signout.png"), show: 'always', type: 'LOGOUT'},
            ]
        };
    }

    renderSingleApp = (rowData) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.appname}>{rowData.appname}</Text>
                <Text style={styles.appid}>{rowData.appid}</Text>
            </View>
        );
    };

    componentDidMount() {
        user_apps(gl_storage.getTokenObj()).then((apps) => {
            let newState = _.cloneDeep(this.state);
            newState.apps = this.ds.cloneWithRows(apps);
            this.setState(newState);
        }).catch((error) => {
            alert('载入用户设备分类列表时出错！');
            console.log(error);
        });
    }
    
    logout = () => {
        gl_storage.signOut().then(() => {
            this.props.navigator.pop();
            if(this.props.logoutcb) {
                this.props.logoutcb();
            }
        });
    };

    onActionSelected = (position) => {
        var evt = this.state.actions[position];
        if(evt.type === 'LOGOUT') {
            this.logout();
        }
    };
    
    render() {
        return (
            <View style={styles.rootContainer}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    actions={this.state.actions}
                    onActionSelected={this.onActionSelected}
                    navIcon={require("../resources/images/back.png")}
                    titleColor="white"
                    onIconClicked={this.props.navigator.pop}
                    title="用户信息" />
                <View style={styles.applistParentContainer}>
                    <Text style={styles.appsSection}>设备分类列表</Text>
                    <ListView
                        style={styles.applist}
                        enableEmptySections={true}
                        dataSource={this.state.apps}
                        renderRow={this.renderSingleApp} />
                </View>
            </View>
        )
    }
}

