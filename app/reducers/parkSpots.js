import * as types from '../actions/types';
import {ListView} from 'react-native'

//TODO: Integrate redux

export const parkSpots = (state = {}, action) => {
    switch (action.type) {
        case types.FETCHING_PARK_SPOTS_SUCCESS:
            return {
                ...state,
                fetching: action.fetching
            };
        case types.FETCHING_PARK_SPOTS_STARTED:
            return {
                ...state,
                fetching: action.fetching
            };
        case types.FETCHING_PARK_SPOTS_FAIL:
            return {
                ...state,
                fetching: action.fetching,
                parkSpotList: action.parkSpotList
            };
        case types.FETCHING_PARK_SPOTS_SAVE:
            return {
                ...state,
                fetching: action.fetching,
                parkSpotList: action.parkSpotList
            }
    }
}