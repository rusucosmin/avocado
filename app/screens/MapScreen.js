import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux';
import MapView from 'react-native-maps';

export default class MapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLocationButton: false,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            marker: {
                opacity: 0,
                latitude: 0,
                longitude: 0
            }
        }
    }

    componentDidMount() {
        console.log("Received: ", this.props);
        this.setInitialCoordinates();
        this.setInitialMarker(this.props.latitude, this.props.longitude);
    }

    setInitialCoordinates() {
        //Map received some coordinates from user
        if ((this.props.latitude !== null && this.props.latitude !== undefined && this.props.latitude !== 0) ||
            (this.props.longitude !== null && this.props.longitude !== undefined && this.props.longitude !== 0)) {
            this.setState({
                region: {
                    ...this.state.region,
                    latitude: this.props.latitude,
                    longitude: this.props.longitude
                }
            })
        }
        else {
            //No coordinates received from user => initialize with user location
            navigator.geolocation.getCurrentPosition((data) => {
                console.log("Location: ", data);
                this.setState({
                    region: {
                        ...this.state.region,
                        latitude: data.coords.latitude,
                        longitude: data.coords.longitude
                    }
                })
            })
        }
    }

    setInitialMarker(lat, long) {
        if((lat !== null && lat !== undefined && lat !== 0) ||
            long !== null && long !== undefined && long !== 0) {
            this.setState({
                    marker: {
                        opacity: 1,
                        latitude: lat,
                        longitude: long
                    }
                },
            );
        }
    }

    setMarker(data) {
        console.log("Set marker: ", data);
        this.setState({
                region: {
                    ...this.state.region,
                    latitude: data.coordinate.latitude,
                    longitude: data.coordinate.longitude
                },
                marker: {
                    opacity: 1,
                    latitude: data.coordinate.latitude,
                    longitude: data.coordinate.longitude
                }
            },
        );
    }

    save() {
        // The map is being passed a function through the parameters so that it can modify the coordinates in parent
        // this.props.setCoordinates modifies the coordinates in the parent
        console.log("this.state.region: ", this.state.region);
        this.props.setCoordinates(this.state.region.latitude, this.state.region.longitude);
        Actions.pop();
    }


    render() {
        return (
            <View>
                <MapView
                    initialRegion={this.state.region}
                    toolbarEnabled
                    showsUserLocation
                    showsMyLocationButton
                    showsPointsOfInterest
                    followsUserLocation
                    loadingEnabled
                    style={styles.map}

                    onLongPress={(data) => {
                        // console.log("Long press: ", data.nativeEvent);
                        this.setMarker(data.nativeEvent);
                    }}
                >

                    <MapView.Marker
                        draggable
                        coordinate={{
                            latitude: this.state.marker.latitude,
                            longitude: this.state.marker.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        title={"Park Spot"}
                        description={"This is your park spot."}

                        style={{opacity: this.state.marker.opacity}}
                    />
                </MapView>
                <TouchableOpacity
                    onPress={() => this.save()}
                    style={styles.saveButton}>
                    <Text style={{fontSize: 16}}> Save </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - StatusBar.currentHeight
    },
    saveButton: {
        flexDirection: 'row',
        marginVertical: 20,
        marginRight: 14,
        alignSelf: 'flex-end',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 16
    }
})