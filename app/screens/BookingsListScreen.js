import React, {Component} from 'react';
import {Alert, AsyncStorage, ListView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import moment from "moment/moment";
import LoadingIndicator from "./LoadingIndicator";

export default class BookingsListScreen extends Component {
    constructor(props) {
        super(props);

        this.empty_booking = {
            name: "No booking found."
        };

        this.state = {
            bookingsDS: global.dsBookings.cloneWithRows([]),
            loading: false
        }
    }

    async loadData() {
        this.setState({loading: true});
        let token = await AsyncStorage.getItem("token");
        return fetch("https://damp-refuge-96622.herokuapp.com/history", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        }).then((response) => {
            if (response.status == 200) {
                return response.json();
            }
            return response;
        }).then((data) => {
            console.log("Bookings: ", data);
            if (data.length == 0) {
                this.setState({bookingsDS: global.dsBookings.cloneWithRows([this.empty_booking])})
            }
            else {
                let future_bookigns = [];
                let DATETIME_THRESHOLD_NOW = Date.now();
                for (let bookingKey in data) {
                    // console.log("Server: ", data[bookingKey].park_spot.name, " - ", moment(data[bookingKey].end_datetime).format("YYYY-MM-DD HH:mm"));
                    // console.log("Moment UTC: ", moment.utc(data[bookingKey].end_datetime).format("YYYY-MM-DD HH:mm"));

                    if (this.getTimeFromData(data[bookingKey].end_datetime) > DATETIME_THRESHOLD_NOW)
                        future_bookigns.push(data[bookingKey]);
                }
                if (future_bookigns.length == 0) {
                    this.setState({bookingsDS: global.dsBookings.cloneWithRows([this.empty_booking])})
                } else {
                    this.setState({bookingsDS: global.dsBookings.cloneWithRows(future_bookigns)})
                }
            }
        }).catch((error) => {
            console.log("Find park spot error: ", error);
            return error;
        }).finally(() => {
            this.setState({loading: false});
        });
    }

    getTimeFromData(stringDatetime) {
        return moment(moment.utc(stringDatetime)).valueOf();
    }

    parseHumanDatetime(datetime) {
        return moment.utc(datetime).format("YYYY-MM-DD HH:mm");
    }

    componentDidMount() {
        Promise.all([this.loadData()]);
    }

    async deleteBooking(bookingId) {
        let token = await AsyncStorage.getItem("token");

        return fetch("https://damp-refuge-96622.herokuapp.com/bookings/" + bookingId.toString(), {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        }).then((response) => {
            if (response.status == 204) {
                Promise.all(this.loadData());
                Alert.alert(
                    "Result",
                    "Booking was successfully deleted",
                    [
                        {
                            text: "Ok", onPress: () => {
                                this.loadData();
                            }
                        },
                        {
                            text: "Go back", onPress: () => {
                                Actions.pop();
                            }
                        }
                    ]
                )
            }
            else {
                Alert.alert("Result", "Booking was not deleted!");
            }
        });
    }

    renderRow(record) {
        console.log("Record: ", record);
        if (record == this.empty_booking) {
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
                            "Are you sure you want to delete this booking?",
                            [
                                {
                                    text: "Yes", onPress: () => {
                                        Promise.all(this.deleteBooking(record.id));
                                    }
                                },
                                {
                                    text: "No", onPress: () => {
                                    }
                                }
                            ],
                            {cancelable: false});
                    }}>
                        <View style={styles.listElement}>
                            <View style={styles.mainListView}>
                                <View style={styles.halfView}>
                                    <Text style={styles.parkspotName}>{record.park_spot.name}</Text>
                                </View>
                                <View style={styles.halfView}>
                                    <Text
                                        style={styles.parkspotAddress}>{this.parseHumanDatetime(record.start_datetime)} to </Text>
                                    <Text
                                        style={styles.parkspotAddress}>{this.parseHumanDatetime(record.end_datetime)} </Text>
                                    <Text style={styles.parkspotAddress}>{record.park_spot.address}</Text>
                                    <Text style={styles.parkspotAddress}>{record.user.phone}</Text>
                                </View>
                            </View>
                            <View style={styles.secondaryListView}>
                                <View style={styles.halfViewTopRight}>
                                    <Text style={styles.parkSpotPrice}>{record.park_spot.price_per_hour} / hr</Text>
                                    <Text style={styles.parkspotSize}>{record.park_spot.size}</Text>
                                </View>
                                <View style={styles.halfViewBottomRight}>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        if (this.state.loading) {
            console.log("Loading...");
            return <LoadingIndicator/>
        } else {
            return (
                <View>
                    <ListView
                        dataSource={this.state.bookingsDS}
                        renderRow={this.renderRow.bind(this)}
                        enableEmptySections={true}
                    />
                </View>
            );
        }
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
    halfViewTopRight: {
        flex: .4,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    halfViewBottomRight: {
        flex: .6,
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
