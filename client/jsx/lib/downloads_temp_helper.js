/**
 * connect to random api
 * retrieve data
 * 
 */
import axios from 'axios';
const GIT_URL = 'https://api.github.com/repositories';

export function getDownloadsData(){
    const url = '';
    const request = axios.get(GIT_URL);
    return request;
}
