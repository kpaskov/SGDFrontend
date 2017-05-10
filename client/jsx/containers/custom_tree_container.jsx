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
import CustomTree from '../components/downloads/custom_tree.jsx';
import {getTreeData} from '../lib/downloads_temp_helper';


class CustomTreeContainer extends Component {
    constructor(props){
        super(props);
        this.state = {selectedLeaf:'',treeData:[]};
        this.leafClick = this.leafClick.bind(this);
        //this.toggle = this.toggle.bind(this);
        
    }
    leafClick(event){
        console.log('leaf click event: ',event.target.id);
        //this.setState({selectedLeaf:event.target.value});
    }
    
    componentDidMount(){
        this.setState({treeData:getTreeData()});
    }
    renderTreeStructure(){
       let treeNodes= this.state.treeData.map((node,index) =>{
            if(node){
                return <CustomTree key={index} node={node} leafClick={this.leafClick} />
            }
        });
        return treeNodes;
    }
    render(){
        let data = this.renderTreeStructure();
        if(data){
            return <div>{data}</div>
        }
    }
}
export default CustomTreeContainer;
