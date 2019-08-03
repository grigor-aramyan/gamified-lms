import axios from 'axios';

import {
    COURSE_CREATED_SUCCESS,
    COURSE_CREATED_FAIL,
    COURSES_GET_SUCCESS,
    COURSES_GET_FAIL,
    COURSE_UPDATE_SUCCESS,
    COURSE_UPDATE_FAIL,
    COURSE_DELETE_SUCCESS,
    COURSE_DELETE_FAIL
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

// Constants
const API_URI = 'http://localhost:4242/api/courses';
//const API_URI = 'https://boiling-shelf-37150.herokuapp.com/api/courses';
export const CREATE_COURSE_ERROR = 'CREATE_COURSE_ERROR';

export const updateCourse = (courseId, newData) => (dispatch, getState) => {

    const uri = `${API_URI}/${courseId}`;

    axios.put(uri, newData, tokenConfig(getState))
        .then(res => {
            // TODO if success, send 'newData' as payload to apply to course in reducer
            dispatch({
                type: COURSE_UPDATE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: COURSE_UPDATE_FAIL });
        });
}

export const deleteCourse = (courseId) => (dispatch, getState) => {

    const uri = `${API_URI}/${courseId}`;

    axios.delete(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: COURSE_DELETE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: COURSE_DELETE_FAIL });
        });
}

export const createCourse = (dataBody) => (dispatch, getState) => {
    
    axios.post(API_URI, dataBody, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: COURSE_CREATED_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, CREATE_COURSE_ERROR));
            dispatch({ type: COURSE_CREATED_FAIL });
        });
}

export const getCourses = () => (dispatch, getState) => {
    
    axios.get(API_URI, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: COURSES_GET_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: COURSES_GET_FAIL });
        });
}