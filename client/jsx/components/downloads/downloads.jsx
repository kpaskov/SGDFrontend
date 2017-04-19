import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import TreeView from 'treeview-react-bootstrap';

export default class Downloads extends Component{
    getInitialState(){
        return {
            data:{name:"Felix", age:25}
        }
    };
    render(){
        return(
        <div><TreeView data={this.state.data} /></div>);
    };
}