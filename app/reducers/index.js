/**
 * Created by Alex on 11/14/2017.
 */
import {users} from './users';

const initialState = {
    user: {}
};

export const reducer = (state = initialState, action) => {
    return {
        ...state,
        user: users(state.user, action)
    };
};
