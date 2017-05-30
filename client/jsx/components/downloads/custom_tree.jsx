/**
 * author:fgondwe
 * date: 05/05/2017
 * purpose: render tree nodes
 */
import React, { Component } from 'react';
import ClassNames from 'classnames';

class CustomTree extends Component {
    constructor(props) {
        super(props);
        this.state={visible:false};
        this.onToggle = this.onToggle.bind(this);
        
    }
      onToggle(event){
        this.setState({visible:!this.state.visible});
        this.props.nodeClick(this.props.node);
    } 
   
    render() {
        let childNodes;
        let style;
        let cssClasses;

        if (this.props.node.childNodes != undefined) {
            childNodes = this.props.node.childNodes.map((node, index) => {
                return (<li key={index} value={index}>
                <CustomTree node={node} leafClick={this.props.leafClick}
                  nodeClick={this.props.nodeClick} /> 
                  </li>);
            });
            cssClasses = {
                'togglable': true,
                'togglable-down': this.state.visible,
                'togglable-up': !this.state.visible
            };

        }
        if (!this.state.visible) {
            style = { display: 'none' };
        }
        if (this.props.node.childNodes == undefined) {
            //leaf node
            return (
                <div>
                    <h5 onClick={this.props.leafClick}  className={ClassNames(cssClasses)}>
                        <a id={this.props.node.title} name={this.props.node.title}>{this.props.node.title}</a>
                    </h5>
                </div>
            );
        }
        else {
            //parent node
            return (
                <div>
                    <h5 onClick={this.onToggle} id={this.props.node.title} className={ClassNames(cssClasses)}>
                        {this.props.node.title}
                    </h5>
                    <ul style={style}>
                        {childNodes}
                    </ul>
                </div>
            );
        }

    }
}
export default CustomTree;