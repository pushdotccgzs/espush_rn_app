/**
 * Created by Sunday on 2016/6/13.
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, AppRegistry, StatusBar, Navigator, ToolbarAndroid, ListView, Image, TouchableOpacity, Linking, Switch, Vibration, ToastAndroid} from 'react-native';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {constant} from "./constant";
import {rt_status, send_at_cmd, get_gpio_status, set_gpio_status, generate_ws_url, change_color_led} from "./httpapi";

var _ = require("lodash");
var base64 = require("base-64");
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
    constructor(props) {
        super(props);
        this.state = {
            relay: false,
            led: false,
            red: 0.1,
            blue: 0.1,
            green: 0.1
        };
    }

    fetch_relay_state = () => {
        let {appid, appkey, chipid} = this.props;
        get_gpio_status(appid, appkey, chipid).then((result) => {
            let edge = _.find(result, ['pin', 5]).edge;
            let newState = _.cloneDeep(this.state);
            newState.relay = edge ? true : false;
            this.setState(newState);
        }).catch((error) => {
            alert(error);
        });
    };

    componentDidMount() {
        this.fetch_relay_state();
    }

    change_relay = (newValue) => {
        let {chipid, appid, appkey} = this.props;
        let edge = newValue ? "1" : "0";
        set_gpio_status(appid, appkey, chipid, 5, edge).then((result) => {
            this.setState(_.set(_.cloneDeep(this.state), 'relay', newValue));
        }).catch((error) => {
            alert('操作失败，请稍后再试！ ' + error);
        });
    };

    change_led = (newValue) => {
        let {chipid, appid, appkey} = this.props;
        let atcmd = "AT+LED=";
        atcmd += newValue ? "1" : "0";
        send_at_cmd(appid, appkey, chipid, atcmd).then((result) => {
            this.setState(_.set(_.cloneDeep(this.state), 'led', newValue));
        }).catch((error) => {
            alert('操作失败，请稍后再试！');
        });
    };

    change_color = (color, newValue) => {
//        alert("COLOR: " + color + " VALUE: " + newValue);
        let {appid, appkey, chipid} = this.props;
        let channel = -1;
        if(color === 'red') {
            channel = 1;
        } else if(color === 'blue') {
            channel = 0;
        } else if(color === 'green') {
            channel = 2;
        }

        let colorValue = Math.floor(newValue / 0.01 * 80);
        change_color_led(appid, appkey, chipid, channel, colorValue).then((result) => {
            console.log('Successful.');
        }).catch((error) => {
            alert('错误: ' + error);
        });
    };

    //控制
    render() {
        return (
            <View style={control_styles.rootContainer}>
                <TouchableOpacity
                    onPress={_.partial(this.change_relay, !this.state.relay)}
                    style={control_styles.switchContainer}>
                    <Text
                        style={control_styles.switchLabel}>继电器</Text>
                    <Switch
                        value={this.state.relay}
                        onValueChange={this.change_relay}
                        style={control_styles.switchWidget} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={_.partial(this.change_led, !this.state.led)}
                    style={control_styles.switchContainer}>
                    <Text style={control_styles.switchLabel}>LED</Text>
                    <Switch
                        value={this.state.led}
                        onValueChange={this.change_led}
                        style={control_styles.switchWidget} />
                </TouchableOpacity>
                <View style={control_styles.colorContainer}>
                    <View style={control_styles.colorItem}>
                        <Text style={[control_styles.colorText, {color: 'red'}]}>红</Text>
                        <Slider
                            minimumValue={0}
                            maximumValue={1}
                            value={this.state.red}
                            minimumTrackTintColor="red"
                            maximumTrackTintColor="red"
                            thumbTintColor="red"
                            style={[control_styles.colorSlider]}
                            onValueChange={_.throttle(_.partial(this.change_color, 'red'), 1000)}
                            value={0.2}/>
                    </View>
                    <View style={control_styles.colorItem}>
                        <Text style={[control_styles.colorText, {color: 'blue'}]}>蓝</Text>
                        <Slider
                            minimumValue={0}
                            maximumValue={1}
                            value={this.state.blue}
                            minimumTrackTintColor="blue"
                            maximumTrackTintColor="blue"
                            thumbTintColor="blue"
                            style={[control_styles.colorSlider]}
                            onValueChange={_.throttle(_.partial(this.change_color, 'blue'), 1000)}
                            value={0.3}/>
                    </View>
                    <View style={control_styles.colorItem}>
                        <Text style={[control_styles.colorText, {color: 'green'}]}>绿</Text>
                        <Slider
                            minimumValue={0}
                            maximumValue={1}
                            value={this.state.green}
                            minimumTrackTintColor="green"
                            maximumTrackTintColor="green"
                            thumbTintColor="green"
                            style={[control_styles.colorSlider]}
                            onValueChange={_.throttle(_.partial(this.change_color, 'green'), 1000)}
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
        fontSize: 20
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
    constructor(props) {
        super(props);
        this.state = {
            temp: 0,
            humi: 0
        }
    }

    fetchData = () => {
        let {chipid, appid, appkey} = this.props;
        //alert("fetch data trace.");
        rt_status(appid, appkey, chipid, "KEY").then((result) => {
            let results_arr = _.split(result, '===');
            let newState = _.cloneDeep(this.state);
            newState.temp = parseInt(results_arr[0]) / 100.0;
            newState.humi = parseInt(results_arr[1]) / 100.0;
            this.setState(newState);
        }).catch((error) => {
            console.log("实时回调失败！");
            console.error(error);
            //alert("fetch data trace 2" + error);
        });
    };

    componentDidMount() {
        this.fetchData();
    }

    onRefreshPressed = () => {
        this.fetchData();
    };

    //DHT11温湿度传感器
    render() {
        return (
            <View style={dht_styles.rootContainer}>

                <View style={dht_styles.topContainer}>
                    <View style={dht_styles.leftContainer}>
                        <Text style={dht_styles.tempText}>当前温度  <Text style={dht_styles.dhtValue}>{this.state.temp} °C</Text></Text>
                        <Text style={dht_styles.humiText}>当前湿度  <Text style={dht_styles.dhtValue}>{this.state.humi} %</Text></Text>
                    </View>
                    <View style={dht_styles.rightContainer}>
                        <Image style={dht_styles.dhtImages} source={require("../resources/images/dht11.png")} />
                    </View>
                </View>

                <View style={dht_styles.bottomContainer}>
                    <TouchableOpacity
                        onPress={this.onRefreshPressed}
                        style={dht_styles.refreshBtn}>
                        <Text style={dht_styles.refreshBtnText}>刷新</Text>
                    </TouchableOpacity>
                    <Text style={dht_styles.refreshSucc}>{/*"刷新成功"*/}</Text>
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
    },
    textContent: {
        marginLeft: 50,
        marginRight: 50,
        lineHeight: 25
    }
});


class IRView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ir: false
        };

        this.connect_to_ws();
    }

    flash_ir_image = (timeout) => {
        //改变状态
        this.setState({
            ir: !this.state.ir
        });
        //设置定时器变回去
        setTimeout(() => {
            this.setState({
                ir: !this.state.ir
            });
        }, timeout);
    };

    componentWillUnmount() {
        this.wsobj.close();
    }

    connect_to_ws = () => {
        let {appid, appkey, chipid} = this.props;
        let url = generate_ws_url(appid, appkey, chipid);
        // alert(url);
        this.wsobj = new WebSocket(url);
        this.wsobj.onopen = () => {
            ToastAndroid.show('已连接到云平台。', ToastAndroid.SHORT);
        };

        this.wsobj.onmessage = (e) => {
            // e.data
            let msg = JSON.parse(e.data);
            let up_msg = base64.decode(msg.body);
            if(up_msg === 'IR1') {
                this.flash_ir_image(500);
                Vibration.vibrate();
            }
        };

        this.wsobj.onerror = (e) => {
            // e.message
            alert('云平台连接发生错误！');
        };

        this.wsobj.onclose = (e) => {
            // e.code, e.reason
            // alert('到服务端的实时连接被断开！');
            ToastAndroid.show('已从云平台连接断开。', ToastAndroid.SHORT);
        };
    };

    //实时数据
    render() {
        var icon = this.state.ir ? require("../resources/images/ir512_red.png") : require("../resources/images/ir512_black.png");
        return (
            <View style={ir_styles.rootContainer}>
                <Image style={ir_styles.images} source={icon} />
                <Text style={ir_styles.textContent}>当上图转为红色时，表明开发板上的红外光电传感器检测到障碍物的变化。</Text>
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
        /**
         {pin: 3, edge: true},
         {pin: 4, edge: false},
         {pin: 5, edge: true},
         {pin: 9, edge: true}
         */
        this.io_status = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.io_status)
        }
    }

    changeGPIO = (pin, newValue) => {
    };

    stateChanged = (pin, newValue) => {
        _.set(this.io_status[_.findIndex(this.io_status, ['pin', pin])], 'edge', newValue);
        this.setState(_.set(_.cloneDeep(this.state), 'dataSource', this.ds.cloneWithRows(this.io_status)));
    };

    fetchData = () => {
        let {appid, appkey, chipid} = this.props;
        get_gpio_status(appid, appkey, chipid).then((result) => {
            console.log(result);
            this.io_status = _.cloneDeep(result);
            _.forEach(this.io_status, (item) => {
                item.edge = (item.edge ? true : false);
            });
            this.io_status = _.filter(this.io_status, (item) => {
                return _.includes([0, 4, 5, 9, 10, 12, 13, 14, 15], item.pin);
            });
            console.log(this.io_status);
            this.setState(_.set(_.cloneDeep(this.state), 'dataSource', this.ds.cloneWithRows(this.io_status)));
        }).catch((error) => {
            alert(error);
        });
    };

    componentDidMount() {
        this.fetchData();
    }

    onValueChanged = (pin, newVal) => {
        let {chipid, appid, appkey} = this.props;
        let edge = newVal ? "1" : "0";
        set_gpio_status(appid, appkey, chipid, pin, edge).then((result) => {
            this.stateChanged(pin, newVal);
        }).catch((error) => {
            alert('操作失败，请稍后再试！ ' + error);
        });
    };

    renderRow = (rowData) => {
        return (
            <TouchableOpacity onPress={_.partial(this.onValueChanged, rowData.pin, !rowData.edge)}>
                <View style={gpio_styles.itemContainer}>
                    <Text style={gpio_styles.gpioText}>GPIO {rowData.pin}</Text>
                    <Switch
                        onValueChange={_.partial(this.onValueChanged, rowData.pin)}
                        value={rowData.edge===true} />
                </View>
            </TouchableOpacity>
        );
    };
    //通用GPIO控制
    render() {
        return (
            <View style={gpio_styles.rootContainer}>
                <ListView
                    enableEmptySections={true}
                    renderRow={this.renderRow}
                    dataSource={this.state.dataSource}/>
            </View>
        )
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


export default class DevDetailView extends Component {
    constructor(props) {
        super(props);
    }
    
    onIconClicked = () => {
        this.props.navigator.pop();
    };

    render() {
        let ControlComponent = null;
        let devInfo = this.props.devInfo;

        if(this.props.devInfo.vertype === 'AT_PLUS') {
            ControlComponent = (
                <ScrollableTabView
                    style={styles.tabContainer}
                    renderTabBar={() => <DefaultTabBar />}>
                    {ControlComponent}
                    <View tabLabel="控制">
                        <ControlView {...devInfo} />
                    </View>
                    <View tabLabel="温湿度">
                        <DhtView {...devInfo} />
                    </View>
                    <View tabLabel="红外">
                        <IRView {...devInfo} />
                    </View>
                </ScrollableTabView>
            );
        } else {
            ControlComponent = (
                <View tabLabel="GPIO">
                    <GPIOView {...devInfo} />
                </View>
            );
        }
        return (
            <View style={styles.rootContainer}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    navIcon={require("../resources/images/back.png")}
                    titleColor="white"
                    onIconClicked={this.onIconClicked}
                    title="设备" />
                {ControlComponent}
            </View>
        );
    }
    
    componentDidMount() {
    }
}

/*
一，如果是专属固件，进入后
    1，rtstatus 查知 温湿度值，led状态等
    2，连接websocket api，接收红外信号
二，如果是非专属固件，进入后
    1，get gpio status，渲染gpio值列表
 */