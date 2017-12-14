/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {Router, Scene, Actions, ActionConst} from "react-native-router-flux"
import {BackHandler} from 'react-native';

import HomeScreen from './app/screens/HomeScreen'
import LoginScreen from './app/screens/SignInScreen'
import SignUpScreen from "./app/screens/SignUpScreen"
import ParkSpotView from "./app/screens/ParkSpotsView"
import { store } from './app/store'
import {ListView} from 'react-native'


global.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import AddParkSpotScreen from "./app/screens/AddParkSpotScreen"
import FormModalScreen from "./app/screens/FormModalScreen"
import MapScreen from './app/screens/MapScreen';
import FindParkSpotScreen from './app/screens/FindParkSpotScreen';
import ParkSpotDetailedViewScreen from './app/screens/ParkSpotDetailedViewScreen';
import AddAvailabilityScreen from './app/screens/AddAvailabilityScreen'

export default class App extends Component {
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => true);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', () => true);
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Scene key="root">
                        <Scene
                            key="signInView"
                            component={LoginScreen}
                            hideNavBar={true}
                            type={ActionConst.RESET}
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
                        <Scene
                            key="parkSpotsView"
                            component={ParkSpotView}
                        />
                        <Scene
                            key="addParkSpotView"
                            title="Add Park Spot"
                            component={AddParkSpotScreen}
                        />
                        <Scene
                            key="formModalView"
                            component={FormModalScreen}
                        />
                        <Scene
                            key="mapView"
                            hideNavBar
                            component={MapScreen}
                        />
                        <Scene
                            key="findParkSpotView"
                            hideNavBar
                            component={FindParkSpotScreen}
                        />
                        <Scene
                            key="parkSpotDetailedView"
                            component={ParkSpotDetailedViewScreen}
                        />
                        <Scene
                            key="addAvailabilityScreen"
                            component={AddAvailabilityScreen}
                        />
                    </Scene>
                </Router>
            </Provider>
        )
    }
}


