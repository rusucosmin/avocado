/**
 * Created by Alex on 11/14/2017.
 */
import {
    SIGN_IN_STARTED, SIGN_IN_SUCCESS, SIGN_IN_FAIL, SAVE_USER_TOKEN,
    SIGN_UP_STARTED, SIGN_UP_SUCCESS, SIGN_UP_FAIL
} from './types'

import {Alert} from 'react-native'
export const signInStarted = (email) => {
    return {
        type: SIGN_IN_STARTED,
        fetching: true,
        email: email
    }
};

export const signInSuccess = () => {
    return {
        type: SIGN_IN_SUCCESS,
        fetching: false,
    }
};

export const signInFail = () => {
    return {
        type: SIGN_IN_FAIL,
        fetching: false,
        token: null
    }
};

export const saveUserToken = (token) => {
    return {
        type: SAVE_USER_TOKEN,
        token: token
    }
};

export const signIn = (email, password) => {
    return (dispatch) => {
        dispatch(signInStarted(email));

        return fetch("https://damp-refuge-96622.herokuapp.com/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                auth: {
                    email: email,
                    password: password
                }
            })
        })
            .then((response) => {
                console.log("Sign in response: ", response);
                if (response.status == 201) {
                    dispatch(signInSuccess());
                    console.log("User connected");
                    return response.json()
                } else {
                    dispatch(signInFail());
                }
            })
            .then((responseData) => {
                console.log("Token: ", responseData.jwt);
                dispatch(saveUserToken(responseData.jwt));
            })
            .catch((error) => {})
    }
};


export const signUpStarted = () => {
    return {
        type: SIGN_UP_STARTED,
        fetching: true
    }
};

export const signUpSuccess = (email) => {
    return {
        type: SIGN_UP_SUCCESS,
        fetching: false,
        email: email
    }
};

export const signUpFail = () => {
    return {
        type: SIGN_UP_FAIL,
        fetching: false
    }
};

export const signUp = (email, password) => {
    return (dispatch) => {
        dispatch(signUpStarted());
        return fetch("https://damp-refuge-96622.herokuapp.com/user", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    email: email,
                    password: password,
                },
            })
        })
            .then((response) => {
                if (response.status == 200) {
                    dispatch(signUpSuccess(email));
                    console.log("User created");
                    return true;
                } else {
                    dispatch(signUpFail());
                    return false
                }
            })
            .catch((error) => {
                return false;
            })
    }
};



