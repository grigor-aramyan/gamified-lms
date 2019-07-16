import {
    LEARNER_CREATED_SUCCESS,
    LEARNER_CREATED_FAIL,
    LEARNER_UPDATE_SUCCESS,
    LEARNER_UPDATE_FAIL,
    LEARNER_DELETE_SUCCESS,
    LEARNER_DELETE_FAIL,
    LEARNERS_GET_SUCCESS,
    LEARNERS_GET_FAIL
} from '../actions/types';

const initialState = {
    token: '',
    learner: null,
    allLearners: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LEARNER_UPDATE_SUCCESS:
            return {
                ...state
            };
        case LEARNER_UPDATE_FAIL:
            return state;
        case LEARNER_DELETE_SUCCESS:
            return {
                ...state,
                token: '',
                learner: null,
                allLearners: []
            };
        case LEARNER_DELETE_FAIL:
            return state;
        case LEARNERS_GET_SUCCESS:
            return {
                ...state,
                allLearners: action.payload
            };
        case LEARNERS_GET_FAIL:
            return state;
        case LEARNER_CREATED_FAIL:
            return state;
        case LEARNER_CREATED_SUCCESS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}