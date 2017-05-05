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
        this.setState({treeData:getTreeData});
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