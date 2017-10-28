import React, { Component } from 'react';

import { View, Button, TextInput, Text, StyleSheet, Alert }
  from 'react-native'

export class LoginScreen extends Component {
  static navigationOptions = ({navigation}) => ({
      title: 'ParkParkGo',
  })
  constructor(props) {
    super(props)
    this.state = {username: '', password: ''}
  }
  render() {
    const { navigate } = this.props.navigation
    const username = this.state.username
    const password = this.state.password
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Login</Text>
        <View style={styles.row}>
          <Text style={styles.textlabel}>Username</Text>
          <TextInput
            style={styles.textinput} placeholder="username"
            onChangeText={(username) => this.setState({username})} />
        </View>
        <View style={styles.row}>
          <Text style={styles.textlabel}>Password</Text>
          <TextInput style={styles.textinput}
            placeholder="password"
            onChangeText={(password) => this.setState({password})}
            secureTextEntry={true}/>
        </View>
        <Button style={styles.row}
          title = "Login"
          onPress={() =>
            // TODO: make request to server, get token, save token for future use
            // and make subsequente needed request
            navigate('Home', {username, password})
          }/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
