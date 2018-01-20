import React, {Component} from "react";
import {RippleLoader} from 'react-native-indicator';
import * as Style from "../styles";
import {StyleSheet, View} from "react-native";

export default class LoginScreen extends Component {
    render() {
        return (
            <View style={styles.loadingIndicatior}>
                <RippleLoader
                    color={Style.general.color5}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    loadingIndicatior: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});