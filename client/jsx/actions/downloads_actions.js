import {getDownloadsData} from '../lib/downloads_temp_helper';

export const FETCH_DOWNLOADS_DATA = 'FETCH_DOWNLOADS_DATA';

export function getData(){
    return {
        type:FETCH_DOWNLOADS_DATA,
        payload: getDownloadsData
    }
}