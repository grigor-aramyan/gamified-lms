import axios from 'axios';
import {
    TEACHERS_GET_SUCCESS,
    TEACHERS_GET_FAIL,
    TEACHER_CREATED_SUCCESS,
    TEACHER_CREATED_FAIL,
    TEACHER_UPDATE_SUCCESS,
    TEACHER_UPDATE_FAIL,
    TEACHER_DELETE_SUCCESS,
    TEACHER_DELETE_FAIL
} from '../actions/types';
import { returnErrors } from './errorActions';
import { tokenConfig } from './authActions';

// Constants
const API_URI = 'http://localhost:4242/api/teachers';
//const API_URI = 'https://boiling-shelf-37150.herokuapp.com/api/teachers';
export const CREATE_TEACHER_ERROR = 'CREATE_TEACHER_ERROR';

export const updateTeacher = (newData) => (dispatch, getState) => {

    axios.put(API_URI, newData, tokenConfig(getState))
        .then(res => {
            // TODO if success, send 'newData' as payload to apply to teacher in reducer
            dispatch({
                type: TEACHER_UPDATE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: TEACHER_UPDATE_FAIL });
        });
}

export const deleteTeacher = () => (dispatch, getState) => {

    axios.delete(API_URI, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: TEACHER_DELETE_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: TEACHER_DELETE_FAIL });
        });
}

export const createTeacher = ({ name, email, password, subject }) => (dispatch, getState) => {
    const body = { name, email, password, subject };

    axios.post(API_URI, body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: TEACHER_CREATED_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, CREATE_TEACHER_ERROR));
            dispatch({ type: TEACHER_CREATED_FAIL });
        });
}

export const getLearners = () => (dispatch, getState) => {
    
    axios.get(API_URI, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: TEACHERS_GET_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: TEACHERS_GET_FAIL });
        });
}