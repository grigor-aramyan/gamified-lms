import axios from 'axios';

import {
    LESSON_CREATED_SUCCESS,
    LESSON_CREATED_FAIL,
    LESSONS_GET_SUCCESS,
    LESSONS_GET_FAIL,
    LESSON_UPDATE_SUCCESS,
    LESSON_UPDATE_FAIL,
    LESSON_DELETE_SUCCESS,
    LESSON_DELETE_FAIL
} from '../actions/types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

// Constants
const API_URI = 'http://localhost:4242/api/lessons';
//const API_URI = 'https://boiling-shelf-37150.herokuapp.com/api/lessons';
export const CREATE_LESSON_ERROR = 'CREATE_LESSON_ERROR';

export const updateLesson = (lessonId, newData) => (dispatch, getState) => {

    const uri = `${API_URI}/${lessonId}`;

    axios.put(uri, newData, tokenConfig(getState))
        .then(res => {
            // TODO if success, send 'newData' as payload to apply to learner in reducer
            dispatch({
                type: LESSON_UPDATE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LESSON_UPDATE_FAIL });
        });
}

export const deleteLesson = (lessonId) => (dispatch, getState) => {

    const uri = `${API_URI}/${lessonId}`;

    axios.delete(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSON_DELETE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LESSON_DELETE_FAIL });
        });
}

export const createLesson = (dataBody) => (dispatch, getState) => {
    
    axios.post(API_URI, dataBody, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSON_CREATED_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LESSON_CREATED_FAIL });
        });
}

export const getLessons = () => (dispatch, getState) => {
    
    axios.get(API_URI, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSONS_GET_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: LESSONS_GET_FAIL });
        });
}