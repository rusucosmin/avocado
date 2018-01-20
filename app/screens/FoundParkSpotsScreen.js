import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {ListView, Text, View, TouchableOpacity, StyleSheet, Image, TextInput, Alert, AsyncStorage} from 'react-native';
import ActionButton from "react-native-action-button";

export default class FoundParkSpotsScreen extends Component {
    constructor(props) {
        super(props);

        this.empty_parking_spot = {
            name: "No parking spots found."
        }

        this.state = {}
    }

    componentDidUpdate() {
        console.log("Found: ", this, props);
    }

    renderRow(record) {
        if (record == this.empty_parking_spot) {
            return (
                <View>
                    <View style={styles.listElement}>
                        <View style={styles.mainListView}>
                            <Text style={styles.parkspotName}>{record.name}</Text>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <TouchableOpacity onPress={() => {
                        Alert.alert("Confirmation",
                            "Are you sure you want to book this park spot?",
                            [
                                {
                                    text: "Yes", onPress: () => {
                                    this.doBookParkSpot(record)
                                }
                                },
                                {
                                    text: "No", onPress: () => {
                                }
                                }
                            ],
                            {cancelable: false}
                        )
                    }}>
                        <View style={styles.listElement}>
                            <View style={styles.mainListView}>
                                <View style={styles.halfView}>
                                    <Text style={styles.parkspotName}>{record.name}</Text>
                                </View>
                                <View style={styles.halfView}>
                                    <Text style={styles.parkspotAddress}>{record.address}</Text>
                                </View>
                            </View>
                            <View style={styles.secondaryListView}>
                                <View style={styles.halfView}>
                                    <Text style={styles.parkSpotPrice}>{record.price_per_hour} / hr</Text>
                                </View>
                                <View style={styles.halfView}>
                                    <Text style={styles.parkspotSize}>{record.size}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    async doBookParkSpot(parkspot) {
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
            return this.bookParkSpot(parkspot,user.id,user.email,token);
        });
    }

    async bookParkSpot(parkspot,userId,userEmail,token) {

        //TODO: integrate into redux flow
        console.log("Book for parkspot: ", parkspot);
        console.log("Book for props: ", this.props);
        return fetch("https://damp-refuge-96622.herokuapp.com/bookings", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({booking: {
                start_datetime: this.props.startDatetime,
                end_datetime: this.props.endDatetime,
                park_spot_id: parkspot.id,
                user_id: userId,}
            })
        }).then(async (response) => {
            console.log("Book park spot response: ", response);
            if (response.status === 200) {
                //TODO: go to FoundParkSpotsScreen
                return response.json();
            }

            return response;
        }).then((data) => {
            console.log("Booked data: ", data);
            this.saveBookingToLocal(
                this.props.startDatetime,
                this.props.endDatetime,
                parkspot.id,
                parkspot.address,
                parkspot.name,
                parkspot.price_per_hour,
                parkspot.size
            );
            Actions.homeView({user: {email: userEmail}})

        }).catch((error) => {
            Actions.homeView({user: {email: userEmail}})
            console.log("Book park spot error: ", error);
            return error;
        })
    }

    async saveBookingToLocal(start_datetime, end_datetime, park_spot_id, address, name, price_per_hour, size) {
        let booking = {
            start_datetime: start_datetime,
            end_datetime: end_datetime,
            park_spot_id: park_spot_id,
            address: address,
            name: name,
            price_per_hour: price_per_hour,
            size: size
        };
        let bookings = await AsyncStorage.getItem("bookings");
        if(bookings !== null) {
            console.log("Local bookings: ", bookings);
            bookings = JSON.parse(bookings);
            console.log("JSON local bookings: ", bookings);
            console.log("Bookings list: ", bookings.bookingsList);
            bookings.bookingsList.push(booking);
        } else {
            bookings = {
                bookingsList: [booking]
            };
            console.log("Local bookings: ", bookings);
        }

        let stringified = JSON.stringify(bookings);
        console.log("Stringified bookings: ", stringified);

        await AsyncStorage.setItem("bookings", stringified);
    }

    render() {
        let parkspots = global.ds_found_park_spots.cloneWithRows(this.props.parkspots);
        if (this.props.parkspots.length == 0) {
            parkspots = global.ds_found_park_spots.cloneWithRows([this.empty_parking_spot])
        }
        return (
            <View>
                <ListView
                    dataSource={parkspots}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}
                />

                {/*<ActionButton*/}
                    {/*title="Book spot"*/}
                    {/*buttonColor="rgba(236,76,60,1)"*/}
                    {/*onPress={() => {*/}
                        {/*this.bookParkSpot()*/}
                    {/*}}>*/}
                    {/*<ActionButton.Item*/}
                        {/*title="See spot"*/}
                        {/*buttonColor="#1abc9c"*/}
                        {/*onPress={() => {*/}

                        {/*}}*/}
                    {/*/>*/}

                {/*</ActionButton>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listElement: {
        flexDirection: 'row',
        padding: 20,
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: '#e2e2e2',
    },
    parkspotName: {
        fontSize: 18
    },
    parkspotAddress: {
        fontSize: 14,
        color: "#c4c4c4",

    },
    parkspotSize: {
        fontSize: 14,
        color: "#c4c4c4",
        textAlign: 'right',
    },
    parkSpotPrice: {
        textAlign: 'right',
        fontSize: 16,

    },
    halfView: {
        flex: .5,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    mainListView: {
        flex: .75,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    secondaryListView: {
        flex: .25,
        justifyContent: 'center',
        flexDirection: 'column'
    }
});