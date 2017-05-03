/**
 * author: fgondwe
 * date: 04/19/2017
 * purpose: widget to render tree-view
 */
import React, { Component } from "react";
import ClassNames from "classnames";
//import cssStyles from '../downloads/downloads_styles.css';

export default class CustomTreeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };
        //   this.printHello = this.printHello.bind(this);

    };
    isLeafNode(node) {
        if (node.childNodes == 'undefined') {
            return true;
        }
        return false;
    }

    isRootNode(node) {
        if (node.childNodes != undefined) {
            return true;
        }
        else {
            return false;
        }

    }
   
    toggle() {

        this.setState({ visible: !this.state.visible });
    };
    render() {
        let childNodes;
        let style;
        let classObj;

        if (this.props.node.childNodes != undefined) {
            childNodes = this.props.node.childNodes.map((node, index) => {
               
                return (<li key={index}><CustomTreeView node={node} /> </li>)
            });
            classObj = {
                'togglable': true,
                'togglable-down': this.state.visible,
                'togglable-up': !this.state.visible
            };
        }
       
        if (this.state.visible) {
            style = { display: 'none' };
        }
        if(this.isLeafNode(this.props.node)){
            console.log(1);
            return (<div>
                <h5 onClick={this.toggle.bind(this)} className={ClassNames(classObj)}>
                    <a href='#'>{this.props.node.title}</a>
                </h5>
                <ul style={style}>
                    {childNodes}
                </ul>
            </div>)
        }
        else{
            console.log(2``);
             return (
            <div>
                <h5 onClick={this.toggle.bind(this)} className={ClassNames(classObj)}>
                    {this.props.node.title}
                </h5>
                <ul style={style}>
                    {childNodes}
                </ul>
            </div>
        );
        }
       
    };
}


