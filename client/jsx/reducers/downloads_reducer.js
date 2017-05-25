import React from 'react';
import * as ActionTypes from '../actions/actionTypes';
import _ from 'underscore';


const initialState = {
    downloadsMenu: [],
    downloadsResults: [],
    query: '',
    selectedLeaf: '',
    url: '',
    queryParams: '',
    tableColumns: []
};

export default function (state = initialState, action) {
    if (action.type === '@@router/UPDATE_LOCATION' && action.payload.pathname === '/downloads') {
        debugger
        let params = action.payload.query;
        console.log('params', params.q);
    }
    switch (action.type) {
        case ActionTypes.FETCH_DOWNLOADS_RESULTS_SUCCESS:
            return Object.assign({}, state, {
                
                downloadsResults: action.payload.datasets,
                query: { q:action.payload.searchTerm},
                selectedLeaf: action.payload.searchTerm
            });
        case ActionTypes.FETCH_DOWNLOADS_MENU:
            return Object.assign({}, state, {
                downloadsMenu: state.downloadsMenu.concat(action.payload.data)
            });
        default:
            return state;
    }
}
