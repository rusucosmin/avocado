/**
 * Created by Alex on 11/14/2017.
 */
import {users} from './users';
import {parkSpots} from './parkSpots'
import {ListView} from 'react-native'


const initialState = {
    user: {},
    parkSpotList: []
};

export const reducer = (state = initialState, action) => {
    return {
        ...state,
        user: users(state.user, action),
        parkSpots: parkSpots(state.parkSpotList, action)
    };
};
