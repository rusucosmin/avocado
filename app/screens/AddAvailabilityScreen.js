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
    TextInput
} from "react-native";
import {Actions} from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class AddAvailabilityScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            park_spot_id: this.props.park_spot_id,
            startDatetime: 0,
            endDatetime: 0,
            until: 0,
            isStartDatetimePickerVisible: false,
            isEndDatetimePickerVisible: false,
            isUntilPickerVisible: false,
            repeat: "never",
            until: null
        }
    }

    showStartDatePicker() {
        console.log("Show start datetime picker");
        this.setState({
            isStartDatetimePickerVisible: true
        })
    }

    showEndDatePicker() {
        this.setState({
            isEndDatetimePickerVisible: true
        })
    }

    showUntilPicker() {
        this.setState({
            isUntilPickerVisible: true
        })
    }

    hideDateTimePicker() {
        this.setState({
            isStartDatetimePickerVisible: false,
            isEndDatetimePickerVisible: false,
            isUntilPickerVisible: false,
        })
    }

    parseDatetime(datetime) {
        return moment(datetime).format("YYYY-MM-DD HH:mm");
    }

    parseDatetimeTimestamp(datetime) {
        return moment(datetime).unix();
    }

    confirmStartDatePicker(datetime) {
        console.log("S datetime: ", datetime);
        console.log("S datetime formatted: ", this.parseDatetime(datetime));
        this.setState({
            startDatetime: this.parseDatetime(datetime)
        });
        this.hideDateTimePicker();
    }

    confirmEndDatePicker(datetime) {
        let startTimestamp = this.parseDatetimeTimestamp(this.state.startDatetime);
        let endTimestamp = this.parseDatetimeTimestamp(datetime);
        if (endTimestamp < startTimestamp) {
            Alert.alert("Oops", "End datetime must be < Start datetime");
        } else {
            this.setState({
                endDatetime: this.parseDatetime(datetime)
            })
        }
        this.hideDateTimePicker();
        console.log("State: ", this.state);
    }

    confirmUntilPicker(datetime) {
        this.setState({
            until: this.parseDatetime(datetime)
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
        let repeat = this.state.repeat;
        let until = this.state.until.toString();
        return {
            park_spot_id, start_datetime, end_datetime, repeat, until
        }
    }

    render() {
        return (
            <View>
                <ScrollView>
                    <Text style={styles.title}> Add Availability </Text>
                    <Text>Repeat: (never,daily,weekly)</Text>
                    <TextInput value={this.state.repeat}
                               onChangeText={(repeat) => this.setState({repeat})}/>
                    <View style={styles.container}>
                        <Text style={styles.subtitle}> Select start time </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.showStartDatePicker();
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
                                this.showEndDatePicker();
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
                            onConfirm={(datetime) => this.confirmStartDatePicker(datetime)}
                            onCancel={() => this.hideDateTimePicker()}
                        />
                        <DateTimePicker
                            mode={"datetime"}
                            isVisible={this.state.isEndDatetimePickerVisible}
                            onConfirm={(datetime) => this.confirmEndDatePicker(datetime)}
                            onCancel={() => this.hideDateTimePicker()}
                        />
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.subtitle}> Select until </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.showUntilPicker();
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
                            isVisible={this.state.isUntilPickerVisible}
                            onConfirm={(datetime) => this.confirmUntilPicker(datetime)}
                            onCancel={() => this.hideDateTimePicker()}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.buttonSignOut}
                        onPress={() => {
                            this.doAdd();
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: 18}}>
                            SAVE
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/*<View style={{flex: 1}}>*/}
                    {/*<Form*/}
                        {/*formName="form"*/}
                        {/*defaults={{}}*/}
                        {/*openModal={(route) => {*/}
                            {/*Actions.formModalView({*/}
                                {/*title: route.title,*/}
                                {/*renderScene: route.renderScene,*/}
                                {/*renderRightButton: route.renderRightButton.bind(route, Actions)*/}
                            {/*})*/}
                        {/*}}*/}

                    {/*>*/}
                        {/*<Form.SeparatorWidget/>*/}

                        {/*<Form.ModalWidget*/}
                            {/*title='Repeat'*/}
                            {/*displayValue='repeat'*/}
                        {/*>*/}
                            {/*<Form.SeparatorWidget/>*/}

                            {/*<Form.SelectWidget name='repeat' title='Repeat' multiple={false}>*/}
                                {/*<Form.OptionWidget title='never' value='never'/>*/}
                                {/*<Form.OptionWidget title='daily' value='daily'/>*/}
                                {/*<Form.OptionWidget title='weekly' value='weekly'/>*/}
                            {/*</Form.SelectWidget>*/}
                        {/*</Form.ModalWidget>*/}

                        {/*<Form.RowWidget*/}
                            {/*name='startDatetime'*/}
                            {/*title={"Start time"}*/}
                            {/*onPress={() => {*/}
                                {/*this.showStartDatePicker()*/}
                            {/*}}*/}
                        {/*/>*/}
                        {/*<Form.RowWidget*/}
                            {/*name='endDatetime'*/}
                            {/*title={"End time"}*/}
                            {/*onPress={() => {*/}
                                {/*this.showEndDatePicker()*/}
                            {/*}}*/}
                        {/*/>*/}
                        {/*<Form.RowWidget*/}
                            {/*name='repeatDatetime'*/}
                            {/*title={"Repeat until"}*/}
                            {/*onPress={() => {*/}
                                {/*this.showUntilPicker()*/}
                            {/*}}*/}
                        {/*/>*/}
                    {/*</Form>*/}


                    {/*<View style={styles.saveButtonContainer}>*/}
                        {/*<TouchableOpacity*/}
                            {/*onPress={() => {*/}
                                {/*this.doAdd()*/}
                                    {/*.then((response) => {*/}
                                        {/*console.log("OK: ", response);*/}
                                        {/*try {*/}
                                            {/*if (response.status === 200) {*/}
                                                {/*// If add successful => close view*/}
                                                {/*Actions.pop();*/}
                                            {/*}*/}
                                        {/*} catch (error) {*/}
                                        {/*}*/}
                                    {/*});*/}
                            {/*}}*/}
                            {/*style={styles.saveButtonTouchable}*/}
                        {/*>*/}
                            {/*<Text style={styles.saveButtonText}>*/}
                                {/*Save*/}
                            {/*</Text>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    {/*<DateTimePicker*/}
                        {/*mode={"datetime"}*/}
                        {/*isVisible={this.state.isStartDatetimePickerVisible}*/}
                        {/*onConfirm={(datetime) => this.confirmStartDatePicker(datetime)}*/}
                        {/*onCancel={() => this.hideDateTimePicker()}*/}
                    {/*/>*/}
                    {/*<DateTimePicker*/}
                        {/*mode={"datetime"}*/}
                        {/*isVisible={this.state.isEndDatetimePickerVisible}*/}
                        {/*onConfirm={(datetime) => this.confirmEndDatePicker(datetime)}*/}
                        {/*onCancel={() => this.hideDateTimePicker()}*/}
                    {/*/>*/}
                    {/*<DateTimePicker*/}
                        {/*mode={"datetime"}*/}
                        {/*isVisible={this.state.isUntilPickerVisible}*/}
                        {/*onConfirm={(datetime) => this.confirmUntilPicker(datetime)}*/}
                        {/*onCancel={() => this.hideDateTimePicker()}*/}
                    {/*/>*/}
                {/*</View>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        margin: 10,
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
});