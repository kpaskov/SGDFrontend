import React, {Component} from 'react';
import ReactDOM from 'react-dom'
//import TreeView from 'treeview-react-bootstrap';
import CustomTreeView from './tree_view.jsx'


export default class Downloads extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let tree={
                title: 'howdy',childNodes: [{title: 'bobby'},{title: 'suzie', childNodes: [{title: 'puppy', childNodes: [
                {title: 'dog house'}]
                },
                {title: 'cherry tree'}
                ]}
                ]
        };
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
        let treeData = tree_test.map((node,key) => {
            return <CustomTreeView key={key} node={node}/>
        });
        return(
        <div>{treeData}</div>);
    }
}