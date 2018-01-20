import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    AsyncStorage,
    TextInput, TouchableWithoutFeedback
} from "react-native";
import {Actions} from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as Style from '../styles';
import {RadioButtons} from "react-native-radio-buttons";

export default class AddAvailabilityScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            park_spot_id: this.props.park_spot_id,
            startDatetime: 0,
            endDatetime: 0,
            untilDatetime: 0,
            isStartDatetimePickerVisible: false,
            isEndDatetimePickerVisible: false,
            isUntilDatetimePickerVisible: false,
            repeat: this.options[0]
        }
    }

    //Radio button options
    options = [
        {
            label: "Never",
            value: "never"
        },
        {
            label: "Daily",
            value: "daily"
        },
        {
            label: "Weekly",
            value: "weekly"
        }
    ];

    setSelectedOption(option) {
        this.setState({
            repeat: option
        })
    }

    renderOption(option, selected, onSelect, index) {
        console.log("Option: ", option);
        console.log("Selected: ", selected);
        const style = selected ?
            {
                fontWeight: 'bold',
                backgroundColor: Style.general.color6,
                color: "#fff",
                padding: 6
            } :
            {
                color: Style.general.color6,
                padding: 6
            };

        return (
            <TouchableOpacity onPress={onSelect} key={index}>
                <Text style={style}> {option.label} </Text>
            </TouchableOpacity>
        );
    }

    renderOptionContainer(options) {
        return (
            <View
                style={{flexDirection: "row", borderWidth: 2, borderColor: Style.general.color6}}
            >
                {options}
            </View>
        )
    }


    showStartDatetimePicker() {
        console.log("Show start datetime picker");
        this.setState({
            isStartDatetimePickerVisible: true
        })
    }

    showEndDatetimePicker() {
        this.setState({
            isEndDatetimePickerVisible: true
        })
    }

    showUntilDatetimePicker() {
        this.setState({
            isUntilDatetimePickerVisible: true
        })
    }

    hideDateTimePicker() {
        this.setState({
            isStartDatetimePickerVisible: false,
            isEndDatetimePickerVisible: false,
            isUntilDatetimePickerVisible: false,
        })
    }

    parseDatetime(datetime) {
        return moment(datetime).format("YYYY-MM-DD HH:mm");
    }

    parseDatetimeTimestamp(datetime) {
        return moment(datetime).unix();
    }

    confirmStartDatetimePicker(datetime) {
        console.log("S datetime: ", datetime);
        console.log("S datetime formatted: ", this.parseDatetime(datetime));
        this.setState({
            startDatetime: this.parseDatetime(datetime)
        });
        this.hideDateTimePicker();
    }

    confirmEndDatetimePicker(datetime) {
        let startTimestamp = this.parseDatetimeTimestamp(this.state.startDatetime);
        let endTimestamp = this.parseDatetimeTimestamp(datetime);
        if (endTimestamp < startTimestamp) {
            Alert.alert("Oops", "Start datetime must be < End datetime");
        } else {
            this.setState({
                endDatetime: this.parseDatetime(datetime)
            })
        }
        this.hideDateTimePicker();
        console.log("State: ", this.state);
    }

    confirmUntilDatetimePicker(datetime) {
        this.setState({
            untilDatetime: this.parseDatetime(datetime)
        });
        this.hideDateTimePicker();
    }

    async doAdd() {
        // Wait for credentials from async storage
        // TODO: use redux for that
        let email = await AsyncStorage.getItem("email");
        let token = await AsyncStorage.getItem("token");

        //TODO: integrate into redux flow
        console.log("Add spot for user: ", email);

        return fetch("https://damp-refuge-96622.herokuapp.com/availability", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({
                availability: this.prepareAvailability()
            })
        }).then(async (response) => {
            console.log("Add availability response: ", response);
            if (response.status !== 200) {
                let data = await response.json();
                console.log("Data: ", data);
            }
            return response;
        }).catch((error) => {
            console.log("Add park spot error: ", error);
            return error;
        })
    }

    prepareAvailability() {
        // TODO: VERIFY IF INPUT WAS GIVEN !!!
        let park_spot_id = this.state.park_spot_id;
        let start_datetime = this.state.startDatetime.toString();
        let end_datetime = this.state.endDatetime.toString();
        let repeat = this.state.repeat.value;
        let until_datetime = this.state.untilDatetime.toString();
        return {
            park_spot_id, start_datetime, end_datetime, repeat, until: until_datetime
        }
    }

    render() {
        return (
            <ScrollView style={{flex: 1, backgroundColor: "#fff"}}>
                <Text style={styles.title}> </Text>
                <View style={[styles.container, {marginBottom: 18}]}>
                    <Text style={styles.subtitle}> Repeat </Text>
                    <RadioButtons
                        options={this.options}
                        selectedOption={this.state.repeat}
                        onSelection={(option) => this.setSelectedOption(option)}
                        renderOption={this.renderOption}
                        optionContainerStyle={styles.optionContainerStyle}
                        renderContainer={this.renderOptionContainer}
                        optionStyle={{fontSize: 30}}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.subtitle}> Select start time </Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.showStartDatetimePicker();
                        }}
                    >
                        <Image
                            source={require('../img/datetime_1.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text style={styles.subtitle}> Select end time </Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.showEndDatetimePicker();
                        }}
                        style={styles.touchable}
                    >
                        <Image
                            source={require('../img/datetime_1.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    <DateTimePicker
                        mode={"datetime"}
                        isVisible={this.state.isStartDatetimePickerVisible}
                        onConfirm={(datetime) => this.confirmStartDatetimePicker(datetime)}
                        onCancel={() => this.hideDateTimePicker()}
                    />
                    <DateTimePicker
                        mode={"datetime"}
                        isVisible={this.state.isEndDatetimePickerVisible}
                        onConfirm={(datetime) => this.confirmEndDatetimePicker(datetime)}
                        onCancel={() => this.hideDateTimePicker()}
                    />
                </View>
                <View
                    style={this.state.repeat.value === "never" ? [styles.hiddenUntilDatetimePicker] : styles.container}>
                    <Text style={styles.subtitle}> Select until time </Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.showUntilDatetimePicker();
                        }}
                        style={styles.touchable}
                    >
                        <Image
                            source={require('../img/datetime_1.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    <DateTimePicker
                        mode={"datetime"}
                        isVisible={this.state.isUntilDatetimePickerVisible}
                        onConfirm={(datetime) => this.confirmUntilDatetimePicker(datetime)}
                        onCancel={() => this.hideDateTimePicker()}
                    />
                </View>

                <View style={[styles.saveButtonContainer]}>
                    <TouchableOpacity
                        style={Style.buttons.fixedBottom.touchable}
                        onPress={() => {
                            this.doAdd();
                        }}
                    >
                        <Text style={Style.buttons.fixedBottom.text}>
                            SAVE
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputView: {
        flex: 1,
        flexDirection: 'row'
    },
    inputHalfView: {
        flex: 1,
        flexDirection: 'row',
    },
    row: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 10,
        textAlign: 'center',
        margin: 10,
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
    },
    icon: {
        height: 90,
        resizeMode: 'contain',
        marginTop: 10,
        marginBottom: 30,
        // aspectRatio: 1
    },
    touchable: {
        backgroundColor: 'transparent',
    },
    buttonSignOut: {
        width: '78%',
        backgroundColor: '#4D9DE0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 14,
        paddingBottom: 14,
    },
    saveButtonContainer: {
        marginTop: 20,
        width: '100%',
        bottom: 0,
        left: 0,
    },
    hiddenUntilDatetimePicker: {
        width: 0,
        height: 0,
        marginBottom: 14
    },
    optionContainerStyle: {
        borderWidth: 2,
        borderColor: Style.general.color6,
        backgroundColor: "red"
    }
});