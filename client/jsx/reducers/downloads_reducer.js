import * as ActionTypes from '../actions/actionTypes';
import _ from 'underscore';

const initialState = {
    downloadsMenu:[],
    downloadsResults:[]
};
export default function(state=initialState,action){
   
    switch(action.type){
        case ActionTypes.FETCH_DOWNLOADS_RESULTS_SUCCESS:
            return Object.assign({},state,{
                downloadsResults: state.downloadsResults.concat(action.payload.datasets)
            });
        case ActionTypes.FETCH_DOWNLOADS_MENU:
            return Object.assign({},state,{
                downloadsMenu: state.downloadsMenu.concat(action.payload.data)
            });
        default:
            return state;
    }
}
