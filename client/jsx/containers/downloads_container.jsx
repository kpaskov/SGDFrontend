import React, {Component} from 'react';
import {connect} from 'react-redux';
import Downloads from '../components/downloads/downloads.jsx';


class DownloadsContainer extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedLeaf:'',
            treeData:[],
            tableData:[],
            path:''

        };
    }
    onLeafClick(event){
        console.log(event);
    }

    render(){
        return(<div><Downloads /></div>);
    }
}

function mapStateToProps({downloads_data}){
    return {downloads_data};

}

export default connect(mapStateToProps)(DownloadsContainer);