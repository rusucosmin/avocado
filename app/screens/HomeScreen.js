import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'redux';
import { View, Button, FlatList, Text, StyleSheet, TouchableOpacity, AsyncStorage, Image} from 'react-native'


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

    seePersonalBookings() {
        Actions.bookingsListScreen();
    }

    render() {
        return (

            <View style={styles.container}>
                <View style={styles.upperScreen}>
                    <Image
                        source={require('../img/homeImage.jpg')}
                        style={styles.backgroundImage}
                    >
                        <TouchableOpacity
                            style={styles.buttonSignOut}
                            onPress={() => {
                                Actions.findParkSpotView();
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 18 }}>
                                Find a Parking Spot
                            </Text>
                        </TouchableOpacity>
                    </Image>
                </View>
                <View style={styles.lowerScreen}>
                    <View style={[styles.screenWidth]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.signOut()
                            }}
                        >
                            <Image
                                source={require('../img/out.png')}
                                style={styles.iconImage}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.screenWidth]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.seePersonalBookings()
                            }}
                        >
                            <Image
                                source={require('../img/booking.png')}
                                style={styles.bookingImage}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.screenWidth]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.seePersonalParkSpots()
                            }}
                        >
                            <Image
                                source={require('../img/parkMe.png')}
                                style={styles.iconImage}/>
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
    },
    upperScreen: {
        flex: .8,
    },
    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 70,
        height: 70,
    },
    bookingImage: {
        width: 60,
        height: 60,
    },
    lowerScreen : {
        flex: .2,
        flexDirection: 'row',
    },
    screenWidth: {
        flex: .33,
        justifyContent: 'center',
        alignItems: 'center',
    },
    h1: {
        fontSize: 40,
        textAlign: 'center',
        margin: 10,
    },
    buttonSignOut: {
        width: '68%',
        backgroundColor: '#FF7F50',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        paddingTop: 20,
        paddingBottom: 20,
    },
});
