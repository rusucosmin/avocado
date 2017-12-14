import React, {Component} from 'react'
import {Alert, StyleSheet, View, Text, Image, TextInput, TouchableOpacity} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {signUp as signUpAction} from '../actions/users';

class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
    }

    signUp() {
        // Here make request to server to register user
        console.log("Signing up...");

        const isEmail = this.verifyEmail(this.state.email);
        const isPassword = this.verifyPassword(this.state.password);

        if (!isEmail) {
            Alert.alert("The email is not valid.");
            return;
        }
        if (!isPassword) {
            Alert.alert("The password should be longer than 8 characters");
            return;
        }

        this.props.signUp(this.state.email, this.state.password)
            .then((response) => {
                if(response === true) {
                    Alert.alert("User successfully created.");
                    Actions.signInView();
                }
                else {
                    Alert.alert("User could not be created.");
                }
            });
    }

    verifyEmail(email) {
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log("Mail verif: " + email.match(pattern));
        if (email.match(pattern) === null) {
            return false;
        }
        return true;
    }

    verifyPassword(password) {
        if (password.length < 8) {
            return false;
        }
        return true;
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
                    <TouchableOpacity
                        style={styles.buttonSignIn}
                        onPress={() => {
                            this.signUp()
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: 18}}>
                            Sign up
                        </Text>
                    </TouchableOpacity>
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

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (email, password) => {
            return dispatch(signUpAction(email, password))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpScreen);



