import React, {Component} from 'react';
import {Alert, AsyncStorage, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Actions} from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as Style from '../styles';

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
            isGoButtonDisabled: true,

            parkspots: [
                {
                    "id": 2,
                    "name": "Nume1234",
                    "user_id": 28,
                    "address": "Adresa1",
                    "latitude": 59.659652421541,
                    "longitude": 61.0031865164638,
                    "price_per_hour": 1,
                    "size": "medium",
                    "description": "Descriere1",
                    "created_at": "2017-12-14T11:03:51.303Z",
                    "updated_at": "2017-12-15T02:42:15.098Z"
                },
                {
                    "id": 3,
                    "name": "zccbg",
                    "user_id": 28,
                    "address": "sftvhjm",
                    "latitude": 46.7807896083203,
                    "longitude": 23.6321057751775,
                    "price_per_hour": 34,
                    "size": "small",
                    "description": "vhubgh",
                    "created_at": "2017-12-14T11:44:48.940Z",
                    "updated_at": "2017-12-15T00:53:04.443Z"
                }
            ]
        }
        // AsyncStorage.removeItem("bookings");
    }

    componentDidUpdate() {
        if(this.state.latitude !== 0 && this.state.longitude !== 0 &&
            this.state.startDatetime !== 0 && this.state.endDatetime !== 0 && this.state.isGoButtonDisabled === true) {
            this.setState({
                isGoButtonDisabled: false
            })
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

    async findParkSpots() {
        // Actions.fountParkSpotsView({parkspots: this.state.parkspots});

        // Wait for credentials from async storage
        // TODO: use redux for that
        let email = await AsyncStorage.getItem("email");
        let token = await AsyncStorage.getItem("token");

        //TODO: integrate into redux flow

        console.log("Find for: ", this.state);

        return fetch("https://damp-refuge-96622.herokuapp.com/find_park_spot", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({
                start_datetime: this.state.startDatetime,
                end_datetime: this.state.endDatetime,
                latitude: this.state.latitude,
                longitude: this.state.longitude
            })
        }).then(async (response) => {
            console.log("Find park spot response: ", response);
            if (response.status === 200) {
                //TODO: go to FoundParkSpotsScreen
                return response.json();
            }

            return response;
        }).then((data) => {
            console.log("Found data: ", data);
            Actions.fountParkSpotsView({
                parkspots: data,
                startDatetime: this.state.startDatetime,
                endDatetime: this.state.endDatetime
            });
        }).catch((error) => {
            console.log("Find park spot error: ", error);
            return error;
        })
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor:"#fff"}}>
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
                <View style={styles.goButtonContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            this.findParkSpots()
                        }}
                        style={Style.buttons.fixedBottom.touchable}
                        disabled={this.state.isGoButtonDisabled}
                    >
                        <Text style={Style.buttons.fixedBottom.text}>
                            GO
                        </Text>
                    </TouchableOpacity>
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
        height: 80,
        resizeMode: 'contain',
        marginTop: 10,
        marginBottom: 30,
        // aspectRatio: 1
    },
    touchable: {
        backgroundColor: 'transparent',
    },
    goButtonContainer: {
        marginTop: 10,
        width: '100%',
        bottom: 0,
        left: 0,
    },
    bottomSpace: {
        height: 60
    }
});