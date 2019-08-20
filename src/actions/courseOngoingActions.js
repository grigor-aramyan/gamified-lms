import axios from 'axios';

import {
    COURSE_ONGOING_CREATED_SUCCESS,
    COURSE_ONGOING_CREATED_FAIL,
    COURSE_ONGOINGS_GET_SUCCESS,
    COURSE_ONGOINGS_GET_FAIL,
    COURSE_ONGOING_UPDATE_SUCCESS,
    COURSE_ONGOING_UPDATE_FAIL,
    COURSE_ONGOING_DELETE_SUCCESS,
    COURSE_ONGOING_DELETE_FAIL,
    COURSE_ONGOING_GET_COURSE_BY_CO_ID,
    COURSE_ONGOING_GET_EXTENDED_COURSE_BY_CO_ID
} from './types';
import { returnErrors } from './errorActions';
import { tokenConfig } from './authActions';

// Constants
const API_URI = 'http://localhost:4242/api/course_ongoings';
//const API_URI = 'https://boiling-shelf-37150.herokuapp.com/api/course_ongoings';
export const CREATE_COURSE_ONGOING_ERROR = 'CREATE_COURSE_ONGOING_ERROR';
export const GET_COURSE_BY_COURSE_ONGOING_ID_ERROR = 'COURSE_ONGOING_GET_COURSE_BY_CO_ID_ERROR';
export const COURSE_ONGOING_GET_EXTENDED_COURSE_BY_CO_ID_ERROR = 'COURSE_ONGOING_GET_EXTENDED_COURSE_BY_CO_ID_ERROR';

export const getExtendedCourseByCourseOngoingId = (courseOngoingId) => (dispatch, getState) => {
    const uri = `${API_URI}/course_extended/${courseOngoingId}`;

    axios.get(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: COURSE_ONGOING_GET_EXTENDED_COURSE_BY_CO_ID,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, COURSE_ONGOING_GET_EXTENDED_COURSE_BY_CO_ID_ERROR));
        });
}

export const getCourseByCourseOngoingId = (courseOngoingId) => (dispatch, getState) => {
    const uri = `${API_URI}/course/${courseOngoingId}`;

    axios.get(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: COURSE_ONGOING_GET_COURSE_BY_CO_ID,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_COURSE_BY_COURSE_ONGOING_ID_ERROR));
        });
}

export const updateCourseOngoing = (courseOngoingId, newData) => (dispatch, getState) => {

    const uri = `${API_URI}/${courseOngoingId}`;

    axios.put(uri, newData, tokenConfig(getState))
        .then(res => {
            // TODO if success, send 'newData' as payload to apply to current course ongoing in reducer
            dispatch({
                type: COURSE_ONGOING_UPDATE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: COURSE_ONGOING_UPDATE_FAIL });
        });
}

export const deleteCourseOngoing = (courseOngoingId) => (dispatch, getState) => {

    const uri = `${API_URI}/${courseOngoingId}`;

    axios.delete(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: COURSE_ONGOING_DELETE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: COURSE_ONGOING_DELETE_FAIL });
        });
}

export const createCourseOngoing = (dataBody) => (dispatch, getState) => {
    
    axios.post(API_URI, dataBody, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: COURSE_ONGOING_CREATED_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, CREATE_COURSE_ONGOING_ERROR));
            dispatch({ type: COURSE_ONGOING_CREATED_FAIL });
        });
}

export const getCourseOngoings = () => (dispatch, getState) => {
    
    axios.get(API_URI, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: COURSE_ONGOINGS_GET_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: COURSE_ONGOINGS_GET_FAIL });
        });
}