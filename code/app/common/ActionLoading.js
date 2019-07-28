/**
 *
 * Copyright 2015-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from "react";
import {ActivityIndicator, Text, StyleSheet, View, Platform} from "react-native";
import {deviceHeight, actionBar} from "../common/CommonDevice";
import {statuBar} from "./CommonDevice";

const ActionLoading = () => (
    <View style={styles.loading}>
        <ActivityIndicator
            size="large"
            color="#3e9ce9"
        />
        <Text style={styles.loadingText}>数据加载中...</Text>
    </View>
);

const styles = StyleSheet.create({
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: Platform.OS === 'ios' ? deviceHeight - 64 : deviceHeight - actionBar - statuBar,
        flex: 1
    },
    loadingText: {
        marginTop: 10,
        textAlign: 'center'
    }
});

export default ActionLoading;
