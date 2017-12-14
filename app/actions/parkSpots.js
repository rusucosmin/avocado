import * as types from './types'
import {parkSpots} from "../reducers/parkSpots";
import {Alert} from 'react-native'

// TODO: Integrate redux

export const fetchingParkSpotsStarted = () => {
    return {
        type: types.FETCHING_PARK_SPOTS_STARTED,
        fetching: true
    }
}

export const fetchingParkSpotsSuccess = () => {
    return {
        type: types.FETCHING_PARK_SPOTS_SUCCESS,
        fetching: false
    }
}
export const fetchingParkSpotsFail = () => {
    return {
        type: types.FETCHING_PARK_SPOTS_FAIL,
        fetching: false,
        parkSpotList: []
    }
}

export const fetchingParkSpotsSave = (parkSpotList) => {
    return {
        type: types.FETCHING_PARK_SPOTS_SAVE,
        fetching: false,
        parkSpotList: parkSpotList
    }
}

export const fetchParkSpots = (token) => {
    return (dispatch) => {
        dispatch(fetchingParkSpotsStarted());

        return fetch("https://damp-refuge-96622.herokuapp.com/user/park_spots", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log("Sign in response: ", response);
                if (response.status == 200) {
                    dispatch(fetchingParkSpotsSuccess());
                    console.log("Park spots fetched");
                    return response.json();
                }
                else {
                    dispatch(fetchingParkSpotsFail())
                }
            })
            .then((responseData) => {
                console.log("List of park spots: ", responseData);
                return dispatch(fetchingParkSpotsSave(responseData))
            })
            .catch((error) => {
            })
    }
}