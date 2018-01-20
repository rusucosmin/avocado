import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'redux';
import {View, Button, FlatList, Text, StyleSheet, TouchableOpacity, AsyncStorage, Image, StatusBar} from 'react-native'
import * as Style from '../styles';


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

    async seeUserProfile() {
        let token = await AsyncStorage.getItem("token");

        return fetch("https://damp-refuge-96622.herokuapp.com/user",{
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
        }).then((response) => {
            if(response.status == 200){
                return response.json();
            }
            return response;
        }).then((user) => {
            Actions.userProfile({user: user});
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<StatusBar backgroundColor="#f6ab58"/>*/}
                <View style={styles.upperScreen}>
                    <Image
                        source={require('../img/home_gradient.png')}
                        style={styles.backgroundImage}
                    >
                        <TouchableOpacity
                            style={styles.buttonFindParkingSpot}
                            onPress={() => {
                                Actions.findParkSpotView();
                            }}
                        >

                            <Text style={styles.textFindParkingSpot}>
                                Find a Parking Spot
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonFindParkingSpot}
                            onPress={() => {
                                Actions.bookingHistory();
                            }}
                        >

                            <Text style={styles.textFindParkingSpot}>
                                See booking history
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonFindParkingSpot}
                            onPress={() => {
                                this.seeUserProfile();
                            }}
                        >

                            <Text style={styles.textFindParkingSpot}>
                                Your profile
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
                                source={require('../img/logout.png')}
                                style={styles.iconImage}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.screenWidth]}>
                        <TouchableOpacity
                            onPress={() => {
                                Promise.all([this.seePersonalBookings()]);
                            }}
                        >
                            <Image
                                source={require('../img/booking.png')}
                                style={styles.iconImage}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.screenWidth]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.seePersonalParkSpots()
                            }}
                        >
                            <Image
                                source={require('../img/my_park_spots.png')}
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
        flex: .9,
    },
    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 30,
        height: 30,
    },
    lowerScreen: {
        backgroundColor: Style.general.color6,
        flex: .1,
        flexDirection: 'row',
    },
    screenWidth: {
        flex: .33,
        justifyContent: 'center',
        alignItems: 'center',
    },
    halfScreenWidth: {
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    h1: {
        fontSize: 40,
        textAlign: 'center',
        margin: 10,
    },
    buttonFindParkingSpot: {
        width: '68%',
        backgroundColor: Style.general.color6,
        // borderWidth: 2,
        // borderColor: '#fff',
        justifyContent: 'center',
        opacity: .8,
        alignItems: 'center',
        marginTop: 0,
        paddingTop: 20,
        paddingBottom: 20,
    },
    textFindParkingSpot: {
        color: "#fff",
        fontSize: 18
    }
})
;
