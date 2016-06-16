/**
 * Created by Sunday on 2016/6/13.
 */

var constant = {
    navBackgroundColor:  '#33B5E5',
    API_BASE_HOME: 'https://espush.cn'
};

let ab2str = (buf) => {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
};

export {constant, ab2str};