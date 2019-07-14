import axios from 'axios';
import { returnErrors } from './errorActions';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOAD_LOCAL_TOKEN,
    SWITCH_TO_LEARNER_LOGIN,
    SWITCH_TO_TEACHER_LOGIN
} from './types';

// Constants
const API_URI = 'http://localhost:4242/api';

export const loginInit = ({ email, password }) => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });

    const body = { email, password };

    const uri = `${API_URI}/auth`;

    axios.post(uri, body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LOGIN_FAIL });
        });
}

export const logoutInit = () => dispatch => {
    dispatch({ type: LOGOUT_SUCCESS });
}

export const swtchToTeacherLogin = () => dispatch => {
    dispatch({ type: SWITCH_TO_TEACHER_LOGIN });
}

export const switchToLearnerLogin = () => dispatch => {
    dispatch({ type: SWITCH_TO_LEARNER_LOGIN });
}

export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });

    const uri = `${API_URI}/auth/user`;

    axios.get(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: AUTH_ERROR });
        });
}

export const loadLocalToken = () => dispatch => {
    try {
        const token = localStorage.getItem('gl_token');

        dispatch({
            type: LOAD_LOCAL_TOKEN,
            payload: token
        });
    } catch(e) {

    }
}

export const tokenConfig = getState => {
    const token = getState().auth.token;

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
}