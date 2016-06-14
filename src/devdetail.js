/**
 * Created by Sunday on 2016/6/13.
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, AppRegistry, StatusBar, Navigator, ToolbarAndroid, ListView, Image, TouchableOpacity, Linking, Switch} from 'react-native';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {constant} from "./constant";

var _ = require("lodash");
var Slider = require('react-native-slider');


const control_styles = StyleSheet.create({
    rootContainer: {
        marginLeft: 15,
        marginRight: 15
    },
    switchContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 20
    },
    colorItem: {
        marginTop: 18
    },
    sliderTrackStyle: {
        // backgroundColor: 'green'
    },
    switchLabel: {
        color: 'black'
    }
});

class ControlView extends Component {
    //控制
    render() {
        return (
            <View style={control_styles.rootContainer}>
                <TouchableOpacity style={control_styles.switchContainer}>
                    <Text style={control_styles.switchLabel}>继电器</Text>
                    <Switch style={control_styles.switchWidget} />
                </TouchableOpacity>
                <TouchableOpacity style={control_styles.switchContainer}>
                    <Text style={control_styles.switchLabel}>LED</Text>
                    <Switch style={control_styles.switchWidget} />
                </TouchableOpacity>
                <View style={control_styles.colorContainer}>
                    <View style={control_styles.colorItem}>
                        <Text style={[control_styles.colorText, {color: 'red'}]}>红</Text>
                        <Slider
                            minimumTrackTintColor="red"
                            maximumTrackTintColor="red"
                            thumbTintColor="red"
                            style={[control_styles.colorSlider]}
                            value={0.2}/>
                    </View>
                    <View style={control_styles.colorItem}>
                        <Text style={[control_styles.colorText, {color: 'blue'}]}>蓝</Text>
                        <Slider
                            minimumTrackTintColor="blue"
                            maximumTrackTintColor="blue"
                            thumbTintColor="blue"
                            style={[control_styles.colorSlider]}
                            value={0.3}/>
                    </View>
                    <View style={control_styles.colorItem}>
                        <Text style={[control_styles.colorText, {color: 'green'}]}>绿</Text>
                        <Slider
                            minimumTrackTintColor="green"
                            maximumTrackTintColor="green"
                            thumbTintColor="green"
                            style={[control_styles.colorSlider]}
                            value={0.4}/>
                    </View>
                </View>
            </View>
        );
    }
}


const dht_styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15
    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    leftContainer: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-around',
        marginLeft:15
        // alignItems: 'center'
    },
    dhtImages: {
        width: 100,
        height: 194,
        marginRight: 40
    },
    tempText: {
        marginBottom: 20,
        fontSize: 20
    },
    humiText: {
        marginTop: 20,
        fontSize: 20,
    },
    dhtValue: {
        color: 'black'
    },
    refreshBtn: {
        width: 100,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'green',
        justifyContent: 'center'
    },
    refreshBtnText: {
        textAlign: 'center'
    },
    refreshSucc: {
        color: 'green'
    }
});

class DhtView extends Component {
    //DHT11温湿度传感器
    render() {
        return (
            <View style={dht_styles.rootContainer}>

                <View style={dht_styles.topContainer}>
                    <View style={dht_styles.leftContainer}>
                        <Text style={dht_styles.tempText}>当前温度  <Text style={dht_styles.dhtValue}>23 °C</Text></Text>
                        <Text style={dht_styles.humiText}>当前湿度  <Text style={dht_styles.dhtValue}>64 %</Text></Text>
                    </View>
                    <View style={dht_styles.rightContainer}>
                        <Image style={dht_styles.dhtImages} source={require("../resources/images/dht11.png")} />
                    </View>
                </View>

                <View style={dht_styles.bottomContainer}>
                    <TouchableOpacity style={dht_styles.refreshBtn}>
                        <Text style={dht_styles.refreshBtnText}>刷新</Text>
                    </TouchableOpacity>
                    <Text style={dht_styles.refreshSucc}>刷新成功</Text>
                </View>

            </View>
        );
    }
}


const ir_styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    images: {
        marginTop: 150,
        width: 128,
        height: 128
    }
});


class IRView extends Component {
    //实时数据
    render() {
        return (
            <View style={ir_styles.rootContainer}>
                <Image style={ir_styles.images} source={require("../resources/images/ir512_black.png")} />
            </View>
        );
    }
}


const gpio_styles = StyleSheet.create({
    rootContainer: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 9
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        padding: 2,
        borderColor: '#E1E1E1'
    },
    gpioText: {
        fontSize: 16,
        color: 'black'
    }
});


class GPIOView extends Component {
    constructor(props) {
        super(props);
        var data = [
            {pin: 3, edge: 1},
            {pin: 4, edge: 0},
            {pin: 5, edge: 0},
            {pin: 9, edge: 1}
        ];
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(data)
        }
    }

    onValueChanged = (newVal, pin) => {
        alert('new val: ' + newVal + ' PIN: ' + pin);
    };

    renderRow = (rowData) => {
        return (
            <TouchableOpacity onPress={_.partial(this.onValueChanged, rowData.pin)}>
                <View style={gpio_styles.itemContainer}>
                    <Text style={gpio_styles.gpioText}>GPIO {rowData.pin}</Text>
                    <Switch value={rowData.edge===1} />
                </View>
            </TouchableOpacity>
        );
    };
    //通用GPIO控制
    render() {
        return (
            <View style={gpio_styles.rootContainer}>
                <ListView
                    renderRow={this.renderRow}
                    dataSource={this.state.dataSource}/>
            </View>
        )
    }
}

export default class DevDetailView extends Component {
    onIconClicked = () => {
        this.props.navigator.pop();
    };

    render() {
        return (
            <View style={styles.rootContainer}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    navIcon={require("../resources/images/back.png")}
                    titleColor="white"
                    onIconClicked={this.onIconClicked}
                    title="设备" />

                <ScrollableTabView
                    style={styles.tabContainer}
                    renderTabBar={() => <DefaultTabBar />}>
                    <View tabLabel="控制">
                        <ControlView />
                    </View>
                    <View tabLabel="温湿度">
                        <DhtView />
                    </View>
                    <View tabLabel="红外">
                        <IRView />
                    </View>
                    <View tabLabel="GPIO">
                        <GPIOView />
                    </View>
                </ScrollableTabView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    rootContainer: {
        flexDirection: 'column',
        flex: 1
    },
    toolbar: {
        height: 48,
        backgroundColor: constant.navBackgroundColor
    },
    tabContainer: {
    }
});
