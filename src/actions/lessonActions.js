import axios from 'axios';

import {
    LESSON_CREATED_SUCCESS,
    LESSON_CREATED_FAIL,
    LESSONS_GET_SUCCESS,
    LESSONS_GET_FAIL,
    LESSON_UPDATE_SUCCESS,
    LESSON_UPDATE_FAIL,
    LESSON_DELETE_SUCCESS,
    LESSON_DELETE_FAIL,
    LESSONS_GET_BY_IDS,
    LESSONS_GET_BY_IDS_INITIATED,
    LESSON_GET_BY_ID,
    LESSON_GET_BY_ID_INITIATED
} from '../actions/types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

// Constants
const API_URI = 'http://localhost:4242/api/lessons';
//const API_URI = 'https://boiling-shelf-37150.herokuapp.com/api/lessons';

export const CREATE_LESSON_ERROR = 'CREATE_LESSON_ERROR';
export const GET_LESSONS_BY_IDS_ERROR = 'GET_LESSONS_BY_IDS_ERROR';
export const GET_LESSON_BY_ID_ERROR = 'GET_LESSON_BY_ID_ERROR';

export const getExtendedLessonsById = (lessonIds) => (dispatch, getState) => {
    const uri = `${API_URI}/extended`;

    dispatch({ type: LESSONS_GET_BY_IDS_INITIATED });

    axios.post(uri, lessonIds, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSONS_GET_BY_IDS,
                payload: res.data.lessons
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_LESSONS_BY_IDS_ERROR));
        });
}

export const getExtendedLessonById = (lessonId) => (dispatch, getState) => {
    const uri = `${API_URI}/extended`;

    dispatch({ type: LESSON_GET_BY_ID_INITIATED });

    const body = {
        lessonsIds: [ lessonId ]
    }

    axios.post(uri, body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSON_GET_BY_ID,
                payload: res.data.lessons[0]
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_LESSON_BY_ID_ERROR));
        });
}

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