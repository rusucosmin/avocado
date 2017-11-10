/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {
    Alert, Text, StyleSheet, Image, View, TextInput, Button, FlatList,
    SectionList
} from 'react-native';
import {
    StackNavigator,
} from 'react-navigation';
import {
    HomeScreen
} from './app/screens/HomeScreen'
import {
    LoginScreen
} from './app/screens/LoginScreen'
import {SignUpScreen} from "./app/screens/SignUpScreen";

const App = StackNavigator({
    Login: {screen: LoginScreen},
    SignUp: {screen: SignUpScreen},
    Home: {screen: HomeScreen},
});

export default App
