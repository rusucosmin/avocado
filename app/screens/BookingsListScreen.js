import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {ListView, Text, View, TouchableOpacity, StyleSheet, Image, TextInput, Alert, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {fetchParkSpots as fetchParkSpotsAction} from '../actions/parkSpots'
import {parkSpots} from "../reducers/parkSpots";
import ActionButton from 'react-native-action-button'

export default class BookingsListScreen extends Component {
    constructor(props) {
        super(props);


        this.state = {
            bookingsDS: global.dsBookings.cloneWithRows([])
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("bookings")
            .then((bookingsObject) => {
                lstres = [
                    {
                        start_datetime: "2017-03-03 13:00",
                        end_datetime: "2017-03-03 14:00",
                        park_spot_id: 1,
                        address: "Street Teodor Mihali nr 9",
                        name: "CJ30ZZZ"
                    }
                ];
                if(bookingsObject !== null){
                    let bookings = JSON.parse(bookingsObject);
                    if(bookings.bookingsList !== null) {
                        let bookingsList = bookings.bookingsList;
                        lstres = bookingsList;
                    }
                }

                this.setState({bookingsDS: global.dsBookings.cloneWithRows(lstres)});
            });
    }

    renderRow(record) {
        return (
            <View>
                <TouchableOpacity onPress={() => {Alert.alert(record.address)}}>
                    <View style={styles.listElement}>
                        <View style={styles.mainListView}>
                            <View style={styles.halfView}>
                                <Text style={styles.parkspotName}>{record.name}</Text>
                            </View>
                            <View style={styles.halfView}>
                                <Text style={styles.parkspotAddress}>{record.start_datetime} to </Text>
                                <Text style={styles.parkspotAddress}>{record.end_datetime} </Text>
                                <Text style={styles.parkspotAddress}>{record.address}</Text>
                            </View>
                        </View>
                        <View style={styles.secondaryListView}>
                            <View style={styles.halfViewTopRight}>
                                <Text style={styles.parkSpotPrice}>{record.price_per_hour} / hr</Text>
                                <Text style={styles.parkspotSize}>{record.size}</Text>
                            </View>
                            <View style={styles.halfViewBottomRight}>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
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
