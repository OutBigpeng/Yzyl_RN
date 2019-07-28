/**
 * Created by Monika on 2017/4/18.
 */
// import StorageUtils from './storage/StorageUtils';
import {AsyncStorage} from "react-native";
import React, {} from "react";
import PropTypes from 'prop-types';

export const saveID = function () {
    let self = this;
    this.id = '';
    this.setId = function (id) {
        self.id = id;
    };
    this.getId = function () {
        return this.id;
    };

    this.getKey = function (key) {
        return String.valueOf(this.getId()) + key;
    };

    this.getItem = function (key) {
        return AsyncStorage.getItem( key, (error, id) => {
            const jsonValue = JSON.parse(id);
            return jsonValue;
        });
    };

    this.setItem = function (key, value) {
        AsyncStorage.setItem(this.getKey(key), JSON.stringify(value));
    };

    this.save = function (key, value) {
        // let me = this;
        // let { key, value } = params;
        // console.log("id--88-----");
        AsyncStorage.setItem(this.getKey(key), JSON.stringify(value));
    };

    this.removeItem = function (key) {
        AsyncStorage.removeItem(this.getKey(key), (error) => {

        });
    };

    this.getGetIdKeys = function () {
        AsyncStorage.getAllKeys((error, keys) => {
            keys.map((key, index) => {
                if (key.toString().indexOf(this.getId()) !== -1) {
                    this.removeItem(key);
                }
            })
        })
    };

    this.getAllKeys = function () {
        AsyncStorage.getAllKeys((error, keys) => {
            keys.map((key, index) => {
                this.removeItem(key);
            })
        })
    }
};

/*

export default  class MyStorage extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this.id = -1;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    getKey(key) {
        return String.valueOf(this.getId()) + key;
    }

    getItem(key) {
        return AsyncStorage.getItem(this.getKey(key));
    }

    setItem(key, value) {
        AsyncStorage.setItem(this.getKey(key), value);
    }

    save(key, value) {
        // let me = this;
        // let { key, value } = params;
        AsyncStorage.setItem(key, value);
    }

    removeItem(key) {
        AsyncStorage.removeItem(this.getKey(key), (error) => {

        });
    }

    getGetIdKeys() {
        AsyncStorage.getAllKeys((error, keys) => {
            keys.map((key, index) => {
                if (key.toString().indexOf(this.getId()) !== -1) {
                    this.removeItem(key);
                }
            })
        })
    }

    getAllKeys() {
        AsyncStorage.getAllKeys((error, keys) => {
            keys.map((key, index) => {
                this.removeItem(key);
            })
        })
    }

    //  removeAll() {
    //      AsyncStorage.removeAll();
    // }
}
// global.MyStorage = MyStorage;
*/
