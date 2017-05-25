import * as URLS from '../lib/downloads_helper';
import Axios from 'axios';
import * as ActionTypes from './actionTypes';

export const fetchDownloadResultsSuccess = (results) => {
    return {
        type: ActionTypes.FETCH_DOWNLOADS_RESULTS_SUCCESS,
        payload: results
    };
};

export const fetchDownloadsMenuSuccess = (results) => {
    return {
        type: ActionTypes.FETCH_DOWNLOADS_MENU,
        payload: results
    };
};

export function fetchDownloadsMenuData(){
      return (dispatch) => {
        return Axios.get(URLS.menuUrl)
            .then(response => {
                dispatch(fetchDownloadsMenuSuccess(response))
            })
            .catch(error => { throw (error) });
    };
};

export const fetchDownloadResults = (searchTerm) => {

    return (dispatch) => {
        return Axios.get(URLS.resultsUrl)
            .then(response => {
                dispatch(fetchDownloadResultsSuccess({datasets:response.data,searchTerm:searchTerm}));
            }).catch(error => { throw (error) });
    };
};


