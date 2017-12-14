import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'redux';
import { View, Button, FlatList, Text, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native'


export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.extractUserFromEmail(this.props.user.email)
        }
    }

    componentDidMount() {
        console.log("Home state: ", this.state);
        console.log("Home props: ", this.props);
    }

    extractUserFromEmail(email) {
        return email.split("@")[0];
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
        return (

            <View style={styles.container}>
                <View style={styles.upperScreen}>
                    <TouchableOpacity
                        style={styles.buttonSignOut}
                        onPress={() => {
                            Actions.findParkSpotView();
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 18 }}>
                            Find Park Spot
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.lowerScreen}>
                    <View style={[styles.halfScreenWidth, {backgroundColor: 'blue'}]}>
                        <TouchableOpacity
                            style={styles.buttonSignOut}
                            onPress={() => {
                                this.seePersonalParkSpots()
                            }}
                        >
                            <Text style={{color: '#fff', fontSize: 18}}>
                                Check out your park spots
                            </Text>
                        </TouchableOpacity>
                        <Text style={{textColor: 'red'}}>Here I am</Text>
                    </View>
                    <View style={[styles.halfScreenWidth, {backgroundColor: 'red'}]}>
                        <TouchableOpacity
                            style={styles.buttonSignOut}
                            onPress={() => {
                                Actions.addParkSpotView();
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 18 }}>
                                Add Park Spot
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonSignOut}
                            onPress={() => {
                                this.signOut()
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 18 }}>
                                Sign out
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
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
    upperScreen: {
        flex: .7,
    },
    lowerScreen : {
        flex: .3,
        flexDirection: 'row',
    },
    halfScreenWidth: {
        flex: .5
    },
    h1: {
        fontSize: 40,
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
