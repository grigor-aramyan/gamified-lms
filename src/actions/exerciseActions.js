import axios from 'axios';
import { returnErrors } from './errorActions';

import {
    CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES,
    GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID
} from './types';
import { tokenConfig } from './authActions';

// Constants
const API_URI = 'http://localhost:4242/api/exercises';
//const API_URI = 'https://boiling-shelf-37150.herokuapp.com/api/exercises';

export const createManySATExercises = (exercises) => (dispatch, getState) => {
    const uri = `${API_URI}/singleAnswerTestQuestion`;

    axios.post(uri, exercises, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES,
                payload: res.data.exercises
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}

export const getSATExercisesByLessonId = (lessonId) => (dispatch, getState) => {
    const uri = `${API_URI}/singleAnswerTestQuestion/${lessonId}`;

    axios.get(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}