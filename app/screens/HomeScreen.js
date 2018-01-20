import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'redux';
import {AsyncStorage, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import * as Style from '../styles';


export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.extractUserFromEmail(this.props.user.email),
            userProfileUpdate: ""
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
        if (this.state.userProfileUpdate == "") {
            Actions.userProfile({user: this.props.user, refreshUser: () => {this.fetchUser(token)}})
        } else {
            Actions.userProfile({
                user: this.state.userProfileUpdate, refreshUser: () => {
                    this.fetchUser(token)
                }
            })
        }

    }

    fetchUser(token) {
        fetch("https://damp-refuge-96622.herokuapp.com/user",{
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
            this.setState({userProfileUpdate: user})
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
                                Find a parking spot
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonFindParkingSpot}
                            onPress={() => {
                                Promise.all([this.seePersonalBookings()]);
                            }}
                        >

                            <Text style={styles.textFindParkingSpot}>
                                See booked spots
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
                                Actions.bookingHistory()
                            }}
                        >
                            <Image
                                source={require('../img/history.png')}
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
                    <View style={[styles.screenWidth]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.seeUserProfile()
                            }}
                        >
                            <Image
                                source={require('../img/profile.png')}
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
            backgroundColor: Style.general.color5,
            flex: .1,
            flexDirection: 'row',
        },
        screenWidth: {
            flex: .25,
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
            backgroundColor: Style.general.color5,
            borderWidth: 2,
            borderColor: Style.general.color1,
            borderRadius: 10,
            justifyContent: 'center',
            opacity: .8,
            alignItems: 'center',
            marginTop: 0,
            marginBottom: 4,
            paddingTop: 20,
            paddingBottom: 20,
        },
        textFindParkingSpot: {
            color: "#fff",
            fontSize: 18
        }
    })
;
