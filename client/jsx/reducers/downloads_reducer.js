import {FETCH_DOWNLOADS_DATA} from '../actions/downloads_actions';

export default function(state=[],action){
    console.log('action received', action);

    /*switch(action.type){
        case FETCH_DOWNLOADS_DATA:
            return [action.payload.data,...state]

    } */
    return state;
}