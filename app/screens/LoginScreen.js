import React, {Component} from 'react';

import {
    View, Button, TextInput, Text, StyleSheet, Alert, Image, TouchableHighlight
}
    from 'react-native'

export class LoginScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'ParkParkGo',
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
    }

    login() {
        const {navigate} = this.props.navigation;
        let verified = true;
        console.log("LOG");
        // Here make request to server to verify if user exists
        fetch("https://damp-refuge-96622.herokuapp.com/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                auth: {
                    email: this.state.email,
                    password: this.state.password,
                }
            })
        })
            .then((response) =>
                response.json()
            )
            .then((responseData) => {
                console.log(responseData.jwt)
                //TODO: do something with jwt. maybe store it.
            })
            .done();
        // .....

        if (verified) {
            navigate('Home', {email: this.state.email, password: this.state.password});
        }
    }

    goToSignUp() {
        const {navigate} = this.props.navigation;
        navigate('SignUp', {email: this.state.email, password: this.state.password});
    }


    render() {

        return (
            <View style={styles.mainView}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>
                        ParkParkGo
                    </Text>
                    <Image
                        source={require('../img/logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.subtitle}>
                        We find it, you park it
                    </Text>
                </View>
                <View style={styles.loginBox}>
                    <TextInput
                        placeholder={"Email"}
                        placeholderTextColor={'#b6b6b4'}
                        defaultValue={this.state.email}
                        onChangeText={(text) => {
                            this.setState({email: text});
                        }}
                        keyboardType={'email-address'}
                        style={styles.inputEmail}
                    />
                    <TextInput
                        placeholder={"Password"}
                        placeholderTextColor={'#b6b6b4'}
                        defaultValue={this.state.password}
                        onChangeText={(text) => {
                            this.setState({password: text});
                        }}
                        secureTextEntry={true}
                        style={styles.inputPassword}
                    />
                    <TouchableHighlight
                        style={styles.buttonSignIn}
                        onPress={() => {
                            this.login()
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: 18}}>
                            Sign in
                        </Text>
                    </TouchableHighlight>
                    <Text style={{marginTop: 12, fontSize: 14, color: "#b6b6b4"}}>
                        <Text> Don't have an account? </Text>
                        <Text style={{fontWeight: 'bold'}}
                              onPress={() => {
                                  this.goToSignUp();
                              }}
                        > SIGN UP </Text>
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    titleBox: {
        flex: 1.2,
        backgroundColor: '#EF823F',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    title: {
        color: '#fff',
        fontSize: 24,
    },
    subtitle: {
        color: '#fff',
        fontSize: 16,
    },
    logo: {
        height: 90,
        resizeMode: 'contain',
        marginTop: 30,
        marginBottom: 30
        // aspectRatio: 1
    },
    loginBox: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'column',
    },
    inputEmail: {
        width: '80%',
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 12,
        fontSize: 16
    },
    inputPassword: {
        width: '80%',
        paddingTop: 20,
        paddingBottom: 12,
        fontSize: 16
    },
    buttonSignIn: {
        width: '78%',
        backgroundColor: '#4D9DE0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 14,
        paddingBottom: 14,
    },
    signUpText: {
        fontSize: 14,
    }

});
const sty = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginBottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    textlabel: {
        fontSize: 20,
        flex: 1,
    },
    textinput: {
        flex: 2,
        fontSize: 20,
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
});
