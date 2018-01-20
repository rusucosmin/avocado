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
global.dsBookings = new ListView.DataSource({rowHasChanged: (r1,r2) => r1!==r2});
global.dsHistoryBookings = new ListView.DataSource({rowHasChanged: (r1,r2) => r1!==r2});
global.dsAdminBookings = new ListView.DataSource({rowHasChanged: (r1,r2) => r1!==r2});
global.dsAdminParkSpots = new ListView.DataSource({rowHasChanged: (r1,r2) => r1!==r2});
global.dsAdminAvailability = new ListView.DataSource({rowHasChanged: (r1,r2) => r1!==r2});


global.ds_found_park_spots = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import AddParkSpotScreen from "./app/screens/AddParkSpotScreen"
import FormModalScreen from "./app/screens/FormModalScreen"
import MapScreen from './app/screens/MapScreen';
import FindParkSpotScreen from './app/screens/FindParkSpotScreen';
import ParkSpotDetailedViewScreen from './app/screens/ParkSpotDetailedViewScreen';
import AddAvailabilityScreen from './app/screens/AddAvailabilityScreen'
import FoundParkSpotsScreen from './app/screens/FoundParkSpotsScreen'
import BookingsListScreen from './app/screens/BookingsListScreen'
import BookingHistoryListScreen from './app/screens/BookingHistoryListScreen'
import UserProfileScreen from './app/screens/UserProfileScreen'
import AdminBookingsScreen from './app/screens/AdminBookingScreen'
import AdminParkSpotsScreen from './app/screens/AdminParkSpotsScreen'
import AdminAvailabilityScreen from './app/screens/AdminAvailabilityScreen'
import AdminHomeScreen from "./app/screens/AdminHomeScreen";

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
                            title={"Search for a park spot"}
                            component={FindParkSpotScreen}
                        />
                        <Scene
                            key="parkSpotDetailedView"
                            title={"Park Spot details"}
                            component={ParkSpotDetailedViewScreen}
                        />
                        <Scene
                            key="addAvailabilityScreen"
                            title={"Add Availability"}
                            component={AddAvailabilityScreen}
                        />
                        <Scene
                            key="fountParkSpotsView"
                            title={"Available park spots"}
                            component={FoundParkSpotsScreen}
                        />
                        <Scene
                            key="bookingsListScreen"
                            title={"Spots booked"}
                            component={BookingsListScreen}
                        />
                        <Scene
                            key="bookingHistory"
                            title={"Booking History"}
                            component={BookingHistoryListScreen}
                        />
                        <Scene
                            key="userProfile"
                            title="Profile"
                            component={UserProfileScreen}
                        />
                        <Scene
                            key="adminBookings"
                            title="Touch booking to delete"
                            component={AdminBookingsScreen}
                        />
                        <Scene
                            key="adminParkSpots"
                            title="Touch park spot to delete"
                            component={AdminParkSpotsScreen}
                        />
                        <Scene
                            key="adminAvailability"
                            title="Touch availability to delete"
                            component={AdminAvailabilityScreen}
                        />
                        <Scene
                            key="adminHome"
                            title="Admin Home"
                            hideNavBar
                            component={AdminHomeScreen}
                        />
                    </Scene>
                </Router>
            </Provider>
        )
    }
}


