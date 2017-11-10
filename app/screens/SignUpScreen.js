import React, {Component} from 'react';

import {
    View, Button, TextInput, Text, StyleSheet, Alert, Image, TouchableHighlight
}
    from 'react-native'

export class SignUpScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {email: '', password: ''};
        console.log("state: ", this.state);
    }

    signUp() {
        const {navigate} = this.props.navigation;
        let successful = true;
        // Here make request to server to register user
        console.log("Signing up...");
        fetch("https://damp-refuge-96622.herokuapp.com/user", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    email: this.state.email,
                    password: this.state.password,
                },
            })
        })
            .then((response) => console.log(response))
            .done();
        // .....
        if (successful) {
            navigate('Login', {});
        }

    }

    render() {
        return (
            <View style={styles.mainView}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>
                        Create new account
                    </Text>
                    <Image
                        source={require('../img/signup2.png')}
                        style={styles.logo}
                    />
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
                            this.signUp()
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: 18}}>
                            Sign up
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    titleBox: {
        flex: 1.2,
        backgroundColor: '#F5C851',
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
        height: 110,
        resizeMode: 'contain',
        marginTop: 30,
        marginLeft: 10,
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
})
