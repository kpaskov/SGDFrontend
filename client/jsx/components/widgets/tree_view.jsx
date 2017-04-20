/**
 * author: fgondwe
 * date: 04/19/2017
 * purpose: widget to render tree-view
 */
import React,{Component} from "react";
import ClassNames from "classnames"
export default class CustomTreeView extends Component {
    constructor(props){
        super(props);
        this.state ={
            visible:true
        };
    };
    toggle(){
        this.setState({visible:!this.state.visible});
    };
    render(){
        let childNodes;
        let style;
        const classObj = {
            'togglable':true,
            'togglable-down': this.state.visible,
            'togglable-up':!this.state.visible
        };

        if(this.props.node.childNodes != null){
            childNodes = this.props.node.childNodes.map((node, index)=>{
                return <li><CustomTreeView node={node} /> </li>
            });
        }
        if(!this.state.visible){
            style = {display:'none'};
        }
        return(
            <div>
                <h5 onClick={this.toggle} className={ClassNames(classObj)}>
                    {this.props.node.title}
                </h5>
                <ul style={style}>
                    {childNodes}
                </ul>
            </div>
        );
    };
}


