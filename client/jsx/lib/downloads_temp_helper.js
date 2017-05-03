/**
 * connect to random api
 * retrieve data
 * 
 */
import axios from 'axios';
const D_API_KEY = 'c3064594b36b486730fc41c5d473c532de444cd7';
const D_ROOT_URL = `https://api.github.com/?access_token=${D_API_KEY}`;

export function getDownloadsData(){
    const url = '';
    const request = axios.get(url);
    return request;
}
