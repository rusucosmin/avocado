import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {ListView, Text, View, TouchableOpacity, StyleSheet, Image, TextInput, Alert, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {fetchParkSpots as fetchParkSpotsAction} from '../actions/parkSpots'
import {parkSpots} from "../reducers/parkSpots";
import ActionButton from 'react-native-action-button'
import * as Style from '../styles';

class AdminParkSpotsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkSpotDS: global.dsAdminParkSpots.cloneWithRows([])
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        AsyncStorage.getItem("token")
            .then((token) => {
                return fetch("https://damp-refuge-96622.herokuapp.com/admin/park_spots", {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        console.log("Get Park Spots response: ", response);
                        if (response.status == 200) {
                            // dispatch(fetchingParkSpotsSuccess());
                            console.log("Park spots fetched");
                            return response.json();
                        }
                        else {
                            dispatch(fetchingParkSpotsFail())
                        }
                    })
                    .then((responseData) => {
                        console.log("List of park spots: ", responseData);
                        if (responseData.length == 0) {
                            Alert.alert("Info", "You do not have any park spot yet. Touch the button to add park spot.");
                        }
                        // dispatch(fetchingParkSpotsSave(responseData))
                        this.setState({parkSpotDS: global.dsAdminParkSpots.cloneWithRows(responseData)})
                    })
                    .catch((error) => {
                    })
            });
    }

    async deleteParkSpot(parkSpotId) {
        let token = await AsyncStorage.getItem("token");

        return fetch("https://damp-refuge-96622.herokuapp.com/park_spot/" + parkSpotId.toString(), {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        }).then((response) => {
            if (response.status == 200) {
                Alert.alert(
                    "Result",
                    "Park Spot was successfully deleted",
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
                Alert.alert("Result", "Park spot was not deleted!");
            }
        });
    }

    renderRow(record) {
        return (
            <View>
                <TouchableOpacity onPress={() => {
                    Alert.alert("Confirmation",
                        "Are you sure you want to delete this park spot?",
                        [
                            {
                                text: "Yes", onPress: () => {
                                    Promise.all(this.deleteParkSpot(record.id));
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

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView
                    dataSource={this.state.parkSpotDS}
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

//TODO: Integrate with redux
const mapStateToProps = (state) => {
    return {
        user: state.user,
        parkSpotList: state.parkSpotList
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchParkSpots: (token) => {
            return dispatch(fetchParkSpotsAction(token))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminParkSpotsScreen);