import * as URLS from '../lib/downloads_helper';
import Axios from 'axios';
import * as ActionTypes from './actionTypes';
import _ from 'underscore';
/**
 * 
 * @param {*} results 
 */
export const fetchDownloadResultsSuccess = (results) => {
    return {
        type: ActionTypes.FETCH_DOWNLOADS_RESULTS_SUCCESS,
        payload: results
    };
};
/**
 * 
 * @param {*} results 
 */
export const fetchDownloadsMenuSuccess = (results) => {
    return {
        type: ActionTypes.FETCH_DOWNLOADS_MENU,
        payload: results
    };
};
/**
 * 
 * @returns 
 */
export function fetchDownloadsMenuData(){
      return (dispatch) => {
        return Axios.get(URLS.menuUrl)
            .then(response => {
                dispatch(fetchDownloadsMenuSuccess(response))
            })
            .catch(error => { throw (error) });
    };
};
/**
 * 
 * @param {*} searchTerm 
 */
export const fetchDownloadResults = (searchTerm) => {

    return (dispatch) => {
        return Axios.get(URLS.resultsUrl)
            .then(response => {
                dispatch(fetchDownloadResultsSuccess({datasets:response.data,searchTerm:searchTerm}));
            }).catch(error => { throw (error) });
    };
};
/**
 * Gets the node that user clicked
 * add the selected node to state
 * @param {*} key 
 */
export const getNode = (key,list) => {
    return (dispatch) =>{
        return dispatch(_.findWhere(list,{key:key}));
    }

};
/**
 * 
 * @param {*} leafKey 
 * @param {*} list 
 */
export const getLeaf = (leafKey,list) => {
     return (dispatch) =>{
        return dispatch(_.findWhere(list,{key:leafKey}));
    }
};
/**
 * 
 * @param {*} leafKey 
 * @param {*} list 
 */
export const deleteLeaf = (leafKey,list) => {
    return (dispatch)=>{
        return dispatch(_.without(list, _.findWhere(list,{key:leafKey})));
    }

};
/**
 * 
 * @param {*} key 
 * @param {*} list 
 */
export const deleteNode = (key,list) => {
    return (dispatch)=>{
        return dispatch(_.without(list, _.findWhere(list,{key:key})));
    }
};

export const toggleNode = (flag)=>{
    return (dispatch) => {
        return dispatch();
    };
};


