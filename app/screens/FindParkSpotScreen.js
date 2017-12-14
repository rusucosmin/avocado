import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert} from "react-native";
import {Actions} from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class FindParkSpotScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            startDatetime: 0,
            endDatetime: 0,
            isStartDatetimePickerVisible: false,
            isEndDatetimePickerVisible: false,
        }
    }

    showStartDatePicker() {
        console.log("Show start datetime picker");
        this.setState({
            isStartDatetimePickerVisible: true
        })
    }

    showEndDatePicker() {
        this.setState({
            isEndDatetimePickerVisible: true
        })
    }

    hideDateTimePicker() {
        this.setState({
            isStartDatetimePickerVisible: false,
            isEndDatetimePickerVisible: false,
        })
    }

    parseDatetime(datetime) {
        return moment(datetime).format("YYYY-MM-DD HH:mm");
    }

    parseDatetimeTimestamp(datetime) {
        return moment(datetime).unix();
    }

    confirmStartDatePicker(datetime) {
        console.log("S datetime: ", datetime);
        console.log("S datetime formatted: ", this.parseDatetime(datetime));
        this.setState({
            startDatetime: this.parseDatetime(datetime)
        });
        this.hideDateTimePicker();
    }

    confirmEndDatePicker(datetime) {
        let startTimestamp = this.parseDatetimeTimestamp(this.state.startDatetime);
        let endTimestamp = this.parseDatetimeTimestamp(datetime);
        if (endTimestamp < startTimestamp) {
            Alert.alert("Oops", "End datetime must be < Start datetime");
        } else {
            this.setState({
                endDatetime: this.parseDatetime(datetime)
            })
        }
        this.hideDateTimePicker();
        console.log("State: ", this.state);
    }

    setCoordinates(lat, long) {
        this.setState({
            latitude: lat,
            longitude: long
        })
    }

    goToMap() {
        //Go to map view
        //Pass the latitude and longitude so the map will be focused already if there were previously selected coordinates
        const latitude = this.state.latitude;
        const longitude = this.state.longitude;

        Actions.mapView({
            latitude, longitude, setCoordinates: (lat, long) => {
                this.setCoordinates(lat, long)
            }
        });
    }

    render() {
        return (
            <ScrollView>
                <Text style={styles.title}> Find a park spot </Text>
                <View style={styles.container}>
                    <Text style={styles.subtitle}> Select location </Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.goToMap();
                        }}
                    >
                        <Image
                            source={require('../img/location_1.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text style={styles.subtitle}> Select start time </Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.showStartDatePicker();
                        }}
                    >
                        <Image
                            source={require('../img/datetime_1.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text style={styles.subtitle}> Select end time </Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.showEndDatePicker();
                        }}
                        style={styles.touchable}
                    >
                        <Image
                            source={require('../img/datetime_1.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    <DateTimePicker
                        mode={"datetime"}
                        isVisible={this.state.isStartDatetimePickerVisible}
                        onConfirm={(datetime) => this.confirmStartDatePicker(datetime)}
                        onCancel={() => this.hideDateTimePicker()}
                    />
                    <DateTimePicker
                        mode={"datetime"}
                        isVisible={this.state.isEndDatetimePickerVisible}
                        onConfirm={(datetime) => this.confirmEndDatePicker(datetime)}
                        onCancel={() => this.hideDateTimePicker()}
                    />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        margin: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
    },
    icon: {
        height: 90,
        resizeMode: 'contain',
        marginTop: 10,
        marginBottom: 30,
        // aspectRatio: 1
    },
    touchable: {
        backgroundColor: 'transparent',
    }

});