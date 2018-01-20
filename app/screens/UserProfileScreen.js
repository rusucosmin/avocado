import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {StyleSheet, AsyncStorage, Alert, TouchableOpacity, Text, View} from 'react-native'
import {connect} from 'react-redux';
import {GiftedForm as Form, GiftedFormManager as FormManager} from 'react-native-gifted-form';
import * as Style from '../styles';

export default class UserProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
        };

    }

    componentWillReceiveProps() {
        console.log("Form props: ", this.props);
    }

    prepareUserData() {
        let email = this.state.user.email;
        let address = FormManager.getValue("form", "address");
        let phone = FormManager.getValue("form", "phone");

        return {
            email: email,
            address: address,
            phone: phone
        }
    }

    async saveUserProfile() {
        let token = await AsyncStorage.getItem("token");

        return fetch("https://damp-refuge-96622.herokuapp.com/user/" + this.state.user.id, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({
                user: this.prepareUserData()
            })
        });
    }

    render() {
        return (
            <View style={{flex: 1}}>
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
                        value={this.state.user.email}
                        clearButtonMode='while-editing'
                        underlineColorAndroid='transparent'
                    />
                    <Form.TextInputWidget
                        name='address' // mandatory
                        title='Address'
                        value={this.state.user.address}
                        clearButtonMode='while-editing'
                        underlineColorAndroid='transparent'
                    />
                    <Form.TextInputWidget
                        name='phone' // mandatory
                        title='Phone'
                        value={this.state.user.phone}
                        underlineColorAndroid='transparent'
                    />

                    <Form.TextInputWidget
                        name='role' // mandatory
                        title='Role'
                        value={this.state.user.role}
                        clearButtonMode='while-editing'
                        underlineColorAndroid='transparent'
                    />
                </Form>

                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            this.saveUserProfile()
                                .then((response) => {
                                    console.log("OK: ", response);
                                    try {
                                        if (response.status === 200) {
                                            // If add successful => close view
                                            Actions.pop();
                                        }
                                    } catch (error) {
                                    }
                                });
                        }}
                        style={Style.buttons.fixedBottom.touchable}
                    >
                        <Text style={Style.buttons.fixedBottom.text}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    saveButtonContainer: {
        marginTop: 10,
        width: '100%',
        bottom: 0,
        left: 0,
    },
    formElement: {
        // paddingTop: 10,
        // paddingBottom: 10,
    },
    availabilityButtonTouchable: {
        width: '100%',
        backgroundColor: Style.general.color1,
        alignItems: 'center'
    },
    availabilityButtonText: {
        padding: 10,
        color: "#fff"
    }
});

