import axios from 'axios';
import { returnErrors } from './errorActions';
import {
    LEARNER_CREATED_SUCCESS,
    LEARNER_CREATED_FAIL,
    LEARNERS_GET_SUCCESS,
    LEARNERS_GET_FAIL,
    LEARNER_UPDATE_SUCCESS,
    LEARNER_UPDATE_FAIL,
    LEARNER_DELETE_SUCCESS,
    LEARNER_DELETE_FAIL
} from './types';
import { tokenConfig, baseUri } from './authActions';

// Constants
const API_URI = baseUri + '/api/learners';
export const CREATE_LEARNER_ERROR = 'CREATE_LEARNER_ERROR';

export const updateLearner = (newData) => (dispatch, getState) => {

    axios.put(API_URI, newData, tokenConfig(getState))
        .then(res => {
            // TODO if success, send 'newData' as payload to apply to learner in reducer
            dispatch({
                type: LEARNER_UPDATE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LEARNER_UPDATE_FAIL });
        });
}

export const deleteLearner = () => (dispatch, getState) => {

    axios.delete(API_URI, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LEARNER_DELETE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LEARNER_DELETE_FAIL });
        });
}

export const createLearner = ({ name, email, password}) => (dispatch, getState) => {
    const body = { name, email, password };

    axios.post(API_URI, body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LEARNER_CREATED_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, CREATE_LEARNER_ERROR));
            dispatch({ type: LEARNER_CREATED_FAIL });
        });
}

export const getLearners = () => (dispatch, getState) => {
    
    axios.get(API_URI, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LEARNERS_GET_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LEARNERS_GET_FAIL });
        });
}