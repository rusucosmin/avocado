import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {Text, View, TouchableHighlight, StyleSheet, Image, TextInput} from 'react-native';
import {connect} from 'react-redux';
import {signIn as signInAction} from '../actions/users';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
    }

    signIn() {
        // Here make request to server to verify if user exists
        this.props.signIn(this.state.email, this.state.password)
            .then(() => {
                const token = this.props.user.token;
                if (token !== null && token !== undefined) {
                    Actions.homeView({user: this.props.user});
                } else {
                    Alert("No user with this data.");
                }
            })
    }

    goToSignUp() {
        Actions.signUpView({email: this.state.email, password: this.state.password});
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
                            this.signIn()
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


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (email, password) => {
            return dispatch(signInAction(email, password))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScreen);


