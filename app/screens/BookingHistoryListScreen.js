import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {ListView, Text, View, TouchableOpacity, StyleSheet, Image, TextInput, Alert, AsyncStorage} from 'react-native';
import ActionButton from 'react-native-action-button'
import moment from "moment/moment";

export default class BookingHistoryListScreen extends Component {
    constructor(props) {
        super(props);

        this.empty_history = {
            name: "No bookings found."
        }

        this.state = {
            bookingsDS: global.dsHistoryBookings.cloneWithRows([])
        }
    }

    async loadData() {
        let token = await AsyncStorage.getItem("token");
        return fetch("https://damp-refuge-96622.herokuapp.com/history", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        }).then((response) => {
            if(response.status == 200){
                return response.json();
            }
            return response;
        }).then((data) => {
            if (data.length == 0) {
                this.setState({bookingsDS: global.dsHistoryBookings.cloneWithRows([this.empty_history])})
            } else {
                future_bookigns = [];
                DATETIME_THRESHOLD_NOW = Date.now();
                for (let bookingKey in data) {
                    if (this.getTimeFromData(data[bookingKey].end_datetime) < DATETIME_THRESHOLD_NOW)
                        future_bookigns.push(data[bookingKey]);
                }
                if (future_bookigns.length == 0) {
                    this.setState({bookingsDS: global.dsHistoryBookings.cloneWithRows([this.empty_history])})
                } else {
                    this.setState({bookingsDS: global.dsHistoryBookings.cloneWithRows(future_bookigns)})
                }
            }
        }).catch((error) => {
            console.log("Find park spot error: ", error);
            return error;
        });
    }

    getTimeFromData(stringDatetime) {
        ROMANIAN_OFFSET = 2 * 60 * 60 * 1000;
        return Date.parse(stringDatetime) - ROMANIAN_OFFSET;
    }

    parseDatetime(datetime) {
        return moment(datetime).format("YYYY-MM-DD HH:mm");
    }

    componentDidMount() {
        Promise.all([this.loadData()]);
    }

    renderRow(record) {
        console.log("Record: ", record);
        if (record == this.empty_history) {
            return (
                <View>
                    <View style={styles.listElement}>
                        <View style={styles.mainListView}>
                            <Text style={styles.parkspotName}>{record.name}</Text>
                        </View>
                    </View>
                </View>);
        } else {
            return (
                <View>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(record.park_spot.address)
                    }}>
                        <View style={styles.listElement}>
                            <View style={styles.mainListView}>
                                <View style={styles.halfView}>
                                    <Text style={styles.parkspotName}>{record.park_spot.name}</Text>
                                </View>
                                <View style={styles.halfView}>
                                    <Text style={styles.parkspotAddress}>{this.parseDatetime(record.start_datetime)}
                                        to </Text>
                                    <Text
                                        style={styles.parkspotAddress}>{this.parseDatetime(record.end_datetime)} </Text>
                                    <Text style={styles.parkspotAddress}>{record.park_spot.address}</Text>
                                    <Text style={styles.parkspotAddress}>{record.user.phone}</Text>
                                </View>
                            </View>
                            <View style={styles.secondaryListView}>
                                <View style={styles.halfViewTopRight}>
                                    {/*<Text style={styles.parkSpotPrice}>{record.park_spot.price_per_hour} / hr</Text>*/}
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
