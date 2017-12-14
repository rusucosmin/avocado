import {
    ADD_PARKING_SPOT_STARTED, ADD_PARKING_SPOT_SUCCESS, ADD_PARKING_SPOT_FAIL
} from './types'

export const addParkingSpotStarted = (token, parking_spot) => {
    return {
        type: ADD_PARKING_SPOT_STARTED,
        fetching: true,
        token: token,
        parking_spot: parking_spot,
    }
};

export const addParkingSpotSuccess = () => {
    return {
        type: ADD_PARKING_SPOT_SUCCESS,
        fetching: false,
    }
};

export const addParkingSpotFail = () => {
    return {
        type: ADD_PARKING_SPOT_FAIL,
        fetching: false,
    }
};