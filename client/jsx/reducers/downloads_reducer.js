import React from 'react';
import * as ActionTypes from '../actions/actionTypes';
import _ from 'underscore';


const initialState = {
    downloadsMenu: [],
    downloadsResults: [],
    query: '',
    selectedLeaf: '',
    selectedNodes: [],
    openNodes: [],
    url: '',
    queryParams: '',
    tableColumns: [],
    nodeVisible:false
};

export default function (state = initialState, action) {
    if (action.type === '@@router/UPDATE_LOCATION' && action.payload.pathname === '/downloads') {
        /**
         * listens to changes in the url
         * fetch data with new query when it changes
         */

        state.query = (typeof action.payload.query.q === 'string') ? action.payload.query.q : '';
        return state;
    }
    switch (action.type) {
        case ActionTypes.FETCH_DOWNLOADS_RESULTS_SUCCESS:
            return Object.assign({}, state, {
                downloadsResults: action.payload.datasets,
                query: { q: action.payload.searchTerm },
                selectedLeaf: action.payload.searchTerm
            });
        case ActionTypes.FETCH_DOWNLOADS_MENU:
            return Object.assign({}, state, {
                downloadsMenu: state.downloadsMenu.concat(action.payload.data)
            });
        case ActionTypes.GET_SELECTED_NODE:
            debugger
            console.log(state.selectedNodes.concat(action.payload.node));
            return Object.assign({}, state, {
                selectedNodes: state.selectedNodes.concat(action.payload.node),
            });

        default:
            return state;
    }
}
