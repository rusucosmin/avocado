import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {Alert, View, Button, FlatList, Text, StyleSheet, TouchableHighlight, AsyncStorage} from 'react-native'
import {connect} from 'redux';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("Home state: ", this.state);
        console.log("Home props: ", this.props);
    }

    signOut() {
        AsyncStorage.removeItem("email");
        AsyncStorage.removeItem("token");
        Actions.signInView();
    }

    seePersonalParkSpots() {
        Actions.parkSpotsView();
    }

    render() {
        const email = this.props.user.email;
        return (
            <View style={styles.container}>
                <Text style={styles.h1}> Welcome, {email}! </Text>
                <TouchableHighlight
                    style={styles.buttonSignOut}
                    onPress={() => {
                        this.seePersonalParkSpots()
                    }}
                >
                    <Text style={{color: '#fff', fontSize: 18}}>
                        Check out your park spots
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                        style={styles.buttonSignOut}
                        onPress={() => {
                            this.signOut()
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: 18}}>
                            Sign out
                        </Text>
                    </TouchableHighlight>
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
    buttonSignOut: {
        width: '78%',
        backgroundColor: '#4D9DE0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 14,
        paddingBottom: 14,
    },
});
