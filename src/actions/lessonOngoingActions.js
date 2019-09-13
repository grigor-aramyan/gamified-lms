import axios from 'axios';

import {
    LESSON_ONGOING_CREATED_SUCCESS,
    LESSON_ONGOING_CREATED_FAIL,
    LESSON_ONGOINGS_GET_SUCCESS,
    LESSON_ONGOINGS_GET_FAIL,
    LESSON_ONGOING_UPDATE_SUCCESS,
    LESSON_ONGOING_UPDATE_FAIL,
    LESSON_ONGOING_DELETE_SUCCESS,
    LESSON_ONGOING_DELETE_FAIL,
    LESSON_ONGOING_GET_LESSON_BY_LO_ID
} from './types';
import { returnErrors } from './errorActions';
import { tokenConfig, baseUri } from './authActions';

// Constants
const API_URI = baseUri + '/api/lesson_ongoings';
export const CREATE_LESSON_ONGOING_ERROR = 'CREATE_LESSON_ONGOING_ERROR';
export const GET_LESSON_BY_LESSON_ONGOING_ID_ERROR = 'LESSON_ONGOING_GET_LESSON_BY_LO_ID_ERROR';

export const getLessonByLessonOngoingId = (lessonOngoingId) => (dispatch, getState) => {
    const uri = `${API_URI}/lesson/${lessonOngoingId}`;

    axios.get(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSON_ONGOING_GET_LESSON_BY_LO_ID,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_LESSON_BY_LESSON_ONGOING_ID_ERROR));
        });
}

export const updateLessonOngoing = (lessonOngoingId, newData) => (dispatch, getState) => {

    const uri = `${API_URI}/${lessonOngoingId}`;

    axios.put(uri, newData, tokenConfig(getState))
        .then(res => {
            // TODO if success, send 'newData' as payload to apply to learner in reducer
            dispatch({
                type: LESSON_ONGOING_UPDATE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LESSON_ONGOING_UPDATE_FAIL });
        });
}

export const updateLessonOngoingByLearningLearner = (lessonOngoingId, newData) => (dispatch, getState) => {

    const uri = `${API_URI}/learner/${lessonOngoingId}`;

    axios.put(uri, newData, tokenConfig(getState))
        .then(res => {
            // TODO if success, send 'newData' as payload to apply to learner in reducer
            dispatch({
                type: LESSON_ONGOING_UPDATE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LESSON_ONGOING_UPDATE_FAIL });
        });
}

export const deleteLessonOngoing = (lessonOngoingId) => (dispatch, getState) => {

    const uri = `${API_URI}/${lessonOngoingId}`;

    axios.delete(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSON_ONGOING_DELETE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LESSON_ONGOING_DELETE_FAIL });
        });
}

export const createLessonOngoing = (dataBody) => (dispatch, getState) => {
    
    axios.post(API_URI, dataBody, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSON_ONGOING_CREATED_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, CREATE_LESSON_ONGOING_ERROR));
            dispatch({ type: LESSON_ONGOING_CREATED_FAIL });
        });
}

export const getLessonOngoings = () => (dispatch, getState) => {
    
    axios.get(API_URI, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSON_ONGOINGS_GET_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LESSON_ONGOINGS_GET_FAIL });
        });
}