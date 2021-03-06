import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {Text, View, TouchableOpacity, StyleSheet, Image, TextInput, Alert, AsyncStorage, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {signIn as signInAction} from '../actions/users';
import * as Style from '../styles';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
    }

    componentDidMount() {
        this.isSignedIn();
    }

    isSignedIn() {
        // TODO: save to store the credentials from async storage when you sign in
        let email, token;
        AsyncStorage.getItem("email")
            .then((response) => {
                email = response;
                console.log("Local email: ", email);
                return AsyncStorage.getItem("token");
            })
            .then((response) => {
                token = response;
                console.log("Local token: ", token);

                if (email !== null && email !== undefined && token !== null && token !== undefined) {
                    console.log("Local signing");
                    const user = {
                        email: email,
                        token: token,
                        fetching: false
                    };
                    Actions.reset("homeView", {user: user});
                }
            })
    }

    signIn() {
        // Here make request to server to verify if user exists
        this.props.signIn(this.state.email, this.state.password)
            .then(() => {
                const token = this.props.user.token;
                if (token !== null && token !== undefined) {
                    AsyncStorage.setItem("email", this.props.user.email);
                    AsyncStorage.setItem("token", token);
                    Actions.reset("homeView", {user: this.props.user});
                } else {
                    Alert.alert("Ooops", "No user with this data.");
                }
            })
    }

    goToSignUp() {
        Actions.signUpView({email: this.state.email, password: this.state.password});
    }

    render() {
        return (
            <View style={styles.mainView}>
                <StatusBar backgroundColor="#f4791c"/>
                <View style={styles.titleBox}>
                    <Image
                        source={require('../img/parkparkgo_login_gradient.png')}
                        style={[styles.imageContainer,styles.backgroundImage]}
                    >
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
                    </Image>

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
                            this.signIn()
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: 18}}>
                            Sign in
                        </Text>
                    </TouchableOpacity>
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
        flex: 1,
        backgroundColor: '#EF823F',
    },
    imageContainer: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: null,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Oswald'
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
        justifyContent: 'center',
        backgroundColor: Style.general.color5,
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


