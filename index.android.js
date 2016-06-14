/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, AppRegistry, StatusBar, Navigator, ToolbarAndroid, BackAndroid} from 'react-native';

import OnlineDevices from "./src/onlinedevices";
import {constant} from "./src/constant";
import EspushAsyncStorage from "./src/storage";


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexDirection: 'column'
    }
});

class espush extends Component {
    constructor(props) {
        super(props);
        this.initStorage();
        let defaultName = 'OnlineDevices';
        let defaultComponent = OnlineDevices;
        this.defaultRoute = {
            name: defaultName,
            component: defaultComponent
        };
    }

    initStorage = () => {
        global.gl_storage = new EspushAsyncStorage();
    };

    configureScene = (route) => {
        return Navigator.SceneConfigs.FadeAndroid;
    };

    renderScene = (route, navigator) => {
        let Component = route.component;
        return <Component {...route.params} navigator={navigator} />;
    };

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if(this.refs.nav) {
                let routes = this.refs.nav.getCurrentRoutes();
                let lastRoute = routes[routes.length - 1];
                if(routes.length === 1) {
                    return false;
                } else {
                    this.refs.nav.pop();
                    return true;
                }
            }
        });
    }


    render() {
        return (
            <View style={styles.rootContainer}>
                <StatusBar
                    // translucent={true}
                    animated={true}
                    backgroundColor={constant.navBackgroundColor} />
                <Navigator
                    ref="nav"
                    initialRoute={this.defaultRoute}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene} />
            </View>
        );
    }
}

AppRegistry.registerComponent('espush', () => espush);

//存储架构，只需要存 email，token, expire_time，使用key espush