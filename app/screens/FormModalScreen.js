import React, {Component} from 'react'
import { ScrollView  } from 'react-native'

export default class FormModalScreen extends Component {
  render () {
    return (
      <ScrollView>
        { this.props.renderScene() }
      </ScrollView>
    )
  }
}