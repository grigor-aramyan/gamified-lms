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

const initialState = {
    token: '',
    teacher: null,
    allTeachers: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case TEACHER_UPDATE_SUCCESS:
            return {
                ...state
            };
        case TEACHER_DELETE_SUCCESS:
            return {
                ...state,
                token: '',
                teacher: null,
                allTeachers: []
            };
        case TEACHERS_GET_SUCCESS:
            return {
                ...state,
                allTeachers: action.payload
            };
        case TEACHER_UPDATE_FAIL:
        case TEACHER_DELETE_FAIL:
        case TEACHERS_GET_FAIL:
        case TEACHER_CREATED_FAIL:
            return state;
        case TEACHER_CREATED_SUCCESS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}