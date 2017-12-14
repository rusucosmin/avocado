import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {StyleSheet, AsyncStorage, Alert, TouchableOpacity, Text} from 'react-native'
import {connect} from 'react-redux';
import {GiftedForm as Form, GiftedFormManager as FormManager} from 'react-native-gifted-form';

export default class ParkSpotDetailedViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            park_spot: this.props.park_spot,
            locationTitle: "Selected location",
        };

        this.props.latitude = this.state.park_spot.latitude;
        this.props.longitude = this.state.park_spot.longitude;

    }

    componentDidUpdate() {
        this.updateLocationTitle();
    }

    componentWillReceiveProps() {
        console.log("Form props: ", this.props);
    }

    updateLocationTitle() {
        //Update the text of the field with location such that will display the selected coordinates
        const latitude = this.state.park_spot.latitude;
        const longitude = this.state.park_spot.longitude;
        const newLocationTitle = "Location             " + latitude + ", " + longitude;
        if (this.state.locationTitle !== newLocationTitle) {
            if (latitude !== undefined && latitude !== null && latitude !== 0 ||
                longitude !== undefined && longitude !== null && longitude !== 0) {
                this.setState({
                    locationTitle: "Location             " + latitude + ", " + longitude
                })
            }
        }
    }

    setCoordinates(lat, long) {
        this.setState({
            park_spot: {
                ...this.state.park_spot,
                latitude: lat,
                longitude: long
            }
        })
    }

    goToMap() {
        //Go to map view
        //Pass the latitude and longitude so the map will be focused already if there were previously selected coordinates
        const latitude = this.state.park_spot.latitude;
        const longitude = this.state.park_spot.longitude;

        Actions.mapView({
            latitude, longitude, setCoordinates: (lat, long) => {
                this.setCoordinates(lat, long)
            }
        });
    }

    async saveParkingSpot() {
        // Wait for credentials from async storage
        // TODO: use redux for that
        let email = await AsyncStorage.getItem("email");
        let token = await AsyncStorage.getItem("token");

        //TODO: integrate into redux flow
        console.log("Add spot for user: ", email);

        return fetch("https://damp-refuge-96622.herokuapp.com/park_spot/" + this.state.park_spot.id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({
                park_spot: this.prepareParkSpotForRequest()
            })
        }).then(async (response) => {
            console.log("Add park spot response: ", response);
            if(response.status !== 200) {
                let data = await response.json();
                console.log("Data: ", data);
                Alert.alert("Ooops", data.error[0]);
            }
            return response;
        }).catch((error) => {
            console.log("Add park spot error: ", error);
            return error;
        })
    }

    prepareParkSpotForRequest() {
        let name = FormManager.getValue("form", "name");
        let address = FormManager.getValue("form", "address");
        let latitude = this.state.park_spot.latitude;
        let longitude = this.state.park_spot.longitude;
        let price_per_hour = FormManager.getValue("form", "price");
        let size = FormManager.getValue("form", "size");
        const sizes = ["small", "medium", "large"];
        let sizeBefore = this.state.park_spot.size;
        size = sizes[size - 1];
        if (size == null)
            size = sizeBefore
        let description = FormManager.getValue("form", "description");

        return {
            name, address, latitude, longitude, price_per_hour, size, description
        }

    }

    render() {
        return (
            <Form
                formName="form"
                defaults={{}}
                openModal={(route) => {
                    Actions.formModalView({
                        title: route.title,
                        renderScene: route.renderScene,
                        renderRightButton: route.renderRightButton.bind(route, Actions)
                    })
                }}

            >
                <Form.SeparatorWidget/>

                <Form.TextInputWidget
                    name='name' // mandatory
                    title='Name'
                    value={this.state.park_spot.name}
                    clearButtonMode='while-editing'
                />
                <Form.TextInputWidget
                    name='address' // mandatory
                    title='Address'
                    value={this.state.park_spot.address}
                    clearButtonMode='while-editing'
                />
                <Form.TextInputWidget
                    name='description' // mandatory
                    title='Description'
                    value={this.state.park_spot.description}
                />

                <Form.TextInputWidget

                    name='price' // mandatory
                    title='Price'
                    value={this.state.park_spot.price_per_hour.toString()}
                    clearButtonMode='while-editing'
                />
                <Form.ModalWidget
                    title='Size'
                    displayValue='size'
                >
                    <Form.SeparatorWidget/>

                    <Form.SelectWidget name='size' title='Size' multiple={false}>
                        <Form.OptionWidget title='1' value='1'/>
                        <Form.OptionWidget title='2' value='2'/>
                        <Form.OptionWidget title='3' value='3'/>
                    </Form.SelectWidget>
                </Form.ModalWidget>

                <Form.RowWidget
                    name='location'
                    title={this.state.locationTitle}
                    onPress={() => {
                        this.goToMap();
                    }}
                />
                {/*TODO: REMOVE THIS*/}
                <Form.SubmitWidget
                    title='Save'
                    widgetStyles={{}}
                    onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                        this.saveParkingSpot()
                            .then(() => {
                                postSubmit();
                                // Actions.homeView();
                            });

                    }}
                />
                <TouchableOpacity
                    style={styles.buttonSignOut}
                    onPress={() => {
                        Actions.addAvailabilityScreen({park_spot_id: this.state.park_spot.id});
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 18 }}>
                        Add Availability
                    </Text>
                </TouchableOpacity>

            </Form>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20
    },
    row: {
        flexDirection: 'row'
    },
    locationInput: {
        textAlign: "left"
    },
    inputText: {
        width: '80%',
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 12,
        fontSize: 16
    },
    h1: {
        fontSize: 40,
        textAlign: 'center',
        margin: 10,
    },
    h2: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    item: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    pickLocationButton: {
        width: '78%',
        backgroundColor: '#4D9DE0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 14,
        paddingBottom: 14,
    },
    buttonSignOut: {
        width: '78%',
        backgroundColor: '#4D9DE0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 14,
        paddingBottom: 14,
    },
});

