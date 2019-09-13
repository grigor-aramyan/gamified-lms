import axios from 'axios';
import { returnErrors } from './errorActions';

import {
    CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES,
    GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID,
    GET_SAT_EXERCISES_INITIATE
} from './types';
import { tokenConfig, baseUri } from './authActions';

// Constants
const API_URI = baseUri + '/api/exercises';

export const createManySATExercises = (exercisesData) => (dispatch, getState) => {
    const uri = `${API_URI}/singleAnswerTestQuestion`;

    axios.post(uri, {exercises: exercisesData}, tokenConfig(getState))
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

    dispatch({ type: GET_SAT_EXERCISES_INITIATE });
    
    axios.get(uri, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID,
                payload: res.data.exercises
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}