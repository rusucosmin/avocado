import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {ListView, Text, View, TouchableOpacity, StyleSheet, Image, TextInput, Alert, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {fetchParkSpots as fetchParkSpotsAction} from '../actions/parkSpots'
import {parkSpots} from "../reducers/parkSpots";

class ParkSpotsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkSpotDS: global.ds.cloneWithRows([])
        }

    }

    componentDidMount() {
        AsyncStorage.getItem("token")
            .then((token) => {
                return fetch("https://damp-refuge-96622.herokuapp.com/user/park_spots", {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        console.log("Sign in response: ", response);
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
                        // dispatch(fetchingParkSpotsSave(responseData))
                        this.setState({parkSpotDS: global.ds.cloneWithRows(responseData)})
                    })
                    .catch((error) => {
                    })
            });
    }

    renderRow(record) {
        return (
            <View>
                <TouchableOpacity onPress={() => console.log("ASOINGI")}>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <View stle={{flex: 1}}>
                            <Text>{record.name}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={{textAlign: 'right'}}>{record.address}</Text>
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
                    dataSource={this.state.parkSpotDS}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}
                />
            </View>
        );
    }
}

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
)(ParkSpotsView);