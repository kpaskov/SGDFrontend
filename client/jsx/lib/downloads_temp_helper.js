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
export function getTreeData(){
      let tree_test=[
            {
                title:'Level 1', 
                childNodes:[
                    {title:'testSubLevel1'},
                    {title:'testSubLevel2'}
                    ]
            },{
                title:'Level 1B', 
                childNodes:[
                    {title:'testSubLevel1B'},
                    {title:'testSubLevel1B2',
                    childNodes:[
                        {title:'testSubLevel1B21'}
                        ]
                    }
                    ]
            }
        ];
        console.log('method call')
        return tree_test;
}
