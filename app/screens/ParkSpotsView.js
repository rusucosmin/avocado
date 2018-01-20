import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {ListView, Text, View, TouchableOpacity, StyleSheet, Image, TextInput, Alert, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {fetchParkSpots as fetchParkSpotsAction} from '../actions/parkSpots'
import {parkSpots} from "../reducers/parkSpots";
import ActionButton from 'react-native-action-button'
import * as Style from '../styles';
import LoadingIndicator from "./LoadingIndicator";

class ParkSpotsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkSpotDS: global.ds.cloneWithRows([]),
            loading: false
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        AsyncStorage.getItem("token")
            .then((token) => {
                this.setState({loading: true});

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
                        this.setState({parkSpotDS: global.ds.cloneWithRows(responseData)})
                    })
                    .catch((error) => {
                    })
                    .finally(() => {
                        this.setState({loading: false})
                    })
            });
    }

    renderRow(record) {
        return (
            <View>
                <TouchableOpacity onPress={() => Actions.parkSpotDetailedView({park_spot: record, refreshParkSpots: () => {this.fetchData()}})}>
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
        if (this.state.loading) {
            console.log("Loading...");
            return <LoadingIndicator/>
        } else {
            return (
                <View style={{flex: 1}}>
                    <ListView
                        dataSource={this.state.parkSpotDS}
                        renderRow={this.renderRow.bind(this)}
                        enableEmptySections={true}
                    />

                    <ActionButton buttonColor={Style.general.color5}
                                  onPress={() => {
                                      Actions.addParkSpotView({refreshParkSpots: () => {this.fetchData()}});
                                  }}/>

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
)(ParkSpotsView);