/**
 * author: fgondwe
 * date: 05/05/2017
 * purpose: manage state for custom tree component
 */
import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import {fetchTreeNodes} from '../actions/index';
import {CustomTree} from '../components/downloads/custom_tree.jsx';
import {getTreeData} from '../lib/downloads_temp_helper';


class CustomTreeContainer extends Component {
    constructor(props){
        super(props);
        this.state = {selectedLeaf:'',treeData:[]};
        this.onLeafClick = this.onLeafClick.bind(this);
    }

    onLeafClick(event){
        console.log('event click: ',event);
        //this.setState({selectedLeaf:event.target.value});
    }
    
    componentDidMount(){
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
        this.setState({treeData:tree_test});
    }
    renderTreeStructure(){
        this.state.treeData.map(node =>{
            console.log(node);
            return <CustomTree node={node} />
        });
    }
    render(){
        <div>{this.renderTreeStructure}</div>
    }

}


export default CustomTreeContainer;