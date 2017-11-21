/**
 * Created by Alex on 11/20/2017.
 */

import {reducer} from './reducers/index';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {signInStarted, signIn} from './actions/users';


const middleware = applyMiddleware(thunk, createLogger());
export const store = createStore(reducer, middleware);
