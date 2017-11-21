import React, {Component} from 'react';
import {View, Button, FlatList, Text, StyleSheet} from 'react-native'
import {connect} from 'redux';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("Home state: ", this.state);
        console.log("Home props: ", this.props);
    }


    render() {
        const email = this.props.user.email;
        return (
            <View style={styles.container}>
                <Text style={styles.h1}> Welcome, {email}! </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    textlabel: {
        fontSize: 20,
        flex: 1,
    },
    textinput: {
        flex: 2,
        fontSize: 20,
    },
    h1: {
        fontSize: 40,
        textAlign: 'center',
        margin: 10,
    },
    h2: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    item: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});
