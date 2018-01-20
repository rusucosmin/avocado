import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {Alert, AsyncStorage, ListView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from "moment/moment";

export default class AdminAvailabilityScreen extends Component {
    constructor(props) {
        super(props);

        this.empty_availability = {
            name: "No availabilities found."
        }

        this.state = {
            availabilityDS: global.dsAdminAvailability.cloneWithRows([])
        }
    }

    componentDidMount() {
        Promise.all([this.loadData()]);
    }

    async loadData() {
        let token = await AsyncStorage.getItem("token");
        return fetch("https://damp-refuge-96622.herokuapp.com/admin/availability", {
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
            if(data.length == 0){
                this.setState({availabilityDS: global.dsAdminAvailability.cloneWithRows([this.empty_availability])})
            }
            else {
                console.log("Availabilities: ", data);
                this.setState({availabilityDS: global.dsAdminAvailability.cloneWithRows(data)})
            }
        }).catch((error) => {
            console.log("Find park spot error: ", error);
            return error;
        });
    }


    parseDatetime(datetime) {
        return moment(datetime).format("YYYY-MM-DD HH:mm");
    }

    async deleteAvailability(availabilityId) {
        let token = await AsyncStorage.getItem("token");

        return fetch("https://damp-refuge-96622.herokuapp.com/availability/" + availabilityId.toString(),{
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        }).then((response) => {
            if(response.status == 200) {
                Alert.alert(
                    "Result",
                    "Availability was successfully deleted",
                    [
                        {text: "Ok", onPress: () => {this.loadData();}},
                        {text: "Go back", onPress: () => {Actions.pop();}}
                    ]
                )
            }
            else{
                Alert.alert("Result","Availability was not deleted!");
            }
        });
    }

    renderRow(record) {
        console.log("record: ", record.park_spot);
        if (record == this.empty_availability) {
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
                            "Are you sure you want to delete this availability?",
                            [
                                {
                                    text: "Yes", onPress: () => {
                                    Promise.all(this.deleteAvailability(record.id));
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
                                    <Text style={styles.parkspotAddress}>{this.parseDatetime(record.start_datetime)}
                                        to </Text>
                                    <Text
                                        style={styles.parkspotAddress}>{this.parseDatetime(record.end_datetime)} </Text>
                                    <Text style={styles.parkspotAddress}>{record.park_spot.address}</Text>
                                </View>
                            </View>
                            <View style={styles.secondaryListView}>
                                <View style={styles.halfViewTopRight}>
                                    {/*<Text style={styles.parkspotSize}>{record.park_spot.size}</Text>*/}
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
                    dataSource={this.state.availabilityDS}
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
