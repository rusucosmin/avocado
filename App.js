/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {Router, Scene} from "react-native-router-flux"

import HomeScreen from './app/screens/HomeScreen'
import LoginScreen from './app/screens/SignInScreen'
import SignUpScreen from "./app/screens/SignUpScreen"
import { store } from './app/store'

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Scene key="root">
                        <Scene
                            key="loginView"
                            component={LoginScreen}
                            hideNavBar={true}
                        />
                        <Scene
                            key="signUpView"
                            component={SignUpScreen}
                            hideNavBar={true}
                        />
                        <Scene
                            key="homeView"
                            component={HomeScreen}
                            hideNavBar={true}
                        />
                    </Scene>
                </Router>
            </Provider>
        )
    }
}


