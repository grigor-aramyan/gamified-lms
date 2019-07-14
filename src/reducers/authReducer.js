import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    LOAD_LOCAL_TOKEN,
    SWITCH_TO_LEARNER_LOGIN,
    SWITCH_TO_TEACHER_LOGIN
} from '../actions/types';

const initialState = {
    token: '',
    isAuthenticated: null,
    isTeacher: false,
    learner: null,
    teacher: null,
    isLoading: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SWITCH_TO_TEACHER_LOGIN:
            return {
                ...state,
                isTeacher: true
            };
        case SWITCH_TO_LEARNER_LOGIN:
            return {
                ...state,
                isTeacher: false
            };
        case LOAD_LOCAL_TOKEN:
            return {
                ...state,
                token: action.payload
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            localStorage.removeItem('gl_token');

            return {
                ...state,
                token: '',
                isAuthenticated: null,
                isTeacher: false,
                learner: null,
                teacher: null,
                isLoading: false
            };
        case LOGIN_SUCCESS:
            localStorage.setItem('gl_token', action.payload.token);

            if (state.isTeacher) {
                return {
                    ...state,
                    teacher: action.payload.user,
                    token: action.payload.token,
                    isAuthenticated: true,
                    isLoading: false
                };
            } else {
                return {
                    ...state,
                    learner: action.payload.user,
                    token: action.payload.token,
                    isAuthenticated: true,
                    isLoading: false
                };
            }
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            if (state.isTeacher) {
                return {
                    ...state,
                    isAuthenticated: true,
                    isLoading: false,
                    teacher: action.payload
                };
            } else {
                return {
                    ...state,
                    isAuthenticated: true,
                    isLoading: false,
                    learner: action.payload
                };
            }
        default:
            return state;
    }
}