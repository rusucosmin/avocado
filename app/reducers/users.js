/**
 * Created by Alex on 11/14/2017.
 */
import * as types from '../actions/types';

export const users = (state = {}, action) => {
    switch (action.type) {
        case types.SIGN_IN_STARTED:
            return {
                ...state,
                fetching: action.fetching,
                email: action.email
            };
        case types.SIGN_IN_SUCCESS:
            return {
                ...state,
                fetching: action.fetching,
            };
        case types.SIGN_IN_FAIL:
            return {
                ...state,
                fetching: action.fetching,
                token: action.token
            };
        case types.SAVE_USER_TOKEN:
            return {
                ...state,
                token: action.token
            };
        case types.SIGN_UP_STARTED:
            return {
                ...state,
                fetching: action.fetching,
            };
        case types.SIGN_UP_SUCCESS:
            return {
                ...state,
                fetching: action.fetching,
                email: action.email
            };
        case types.SIGN_UP_FAIL:
            return {
                ...state,
                fetching: action.fetching,
            };
        default:
            return state;
    }
};