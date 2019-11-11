import axios from 'axios';
import { returnErrors } from './errorActions';

import {
    CREATE_MANY_AUDIO_EXERCISES,
    GET_AUDIO_EXERCISES_BY_LESSON_ID,
    GET_AUDIO_EXERCISES_INITIATE,
    LESSON_FOR_TEACHER_UPDATE_AQ_BASE
} from './types';
import { tokenConfig, baseUri } from './authActions';

// Constants
const API_URI = baseUri + '/api/exercises';

export const updateLessonAqBase = (deletedIds, exercises) => (dispatch, getState) => {
    const uri = `${API_URI}/audioQuestion/updateLessonAqBase`;

    const body = {
        deletedIds,
        exercises
    };

    axios.post(uri, body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LESSON_FOR_TEACHER_UPDATE_AQ_BASE,
                payload: res.data.exercises
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}

export const createManyAQExercises = (exercisesData) => (dispatch, getState) => {
    const uri = `${API_URI}/audioQuestion`;

    axios.post(uri, {exercises: exercisesData}, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: CREATE_MANY_AUDIO_EXERCISES,
                payload: res.data.exercises
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}

export const getAQExercisesByLessonId = (lessonId) => (dispatch, getState) => {
    const uri = `${API_URI}/audioQuestion/${lessonId}`;

    dispatch({ type: GET_AUDIO_EXERCISES_INITIATE });
    
    axios.get(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_AUDIO_EXERCISES_BY_LESSON_ID,
                payload: res.data.exercises
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}