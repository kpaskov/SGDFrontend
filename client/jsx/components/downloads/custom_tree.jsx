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
        this.state={visible:true};
        //this.onToggle = this.onToggle.bind(this);
        
    }
    onToggle(event){
        debugger
        console.log('on toggle', event);
        this.setState({visible:!this.state.visible});
    }
   /* toggle() {
        console.log('toggle event');
        //this.setState({ visible: !this.state.visible });
    }*/
    render() {
        let childNodes;
        let style;
        let cssClasses;

        if (this.props.node.childNodes != undefined) {
            childNodes = this.props.node.childNodes.map((node, index) => {
                return (<li key={index} value={index}>
                <CustomTree node={node} leafClick={this.props.leafClick}
                  nodeToggle={this.props.nodeToggle} /> 
                  </li>);
            });
            cssClasses = {
                'togglable': true,
                'togglable-down': this.props.visible,
                'togglable-up': !this.props.visible
            };

        }
        if (this.state.visible) {
            style = { display: 'none' };
        }
        if (this.props.node.childNodes == undefined) {
            //leaf node
            return (
                <div>
                    <h5 onClick={this.props.leafClick} className={ClassNames(cssClasses)}>
                        <a id={this.props.node.title} name={this.props.node.title}>{this.props.node.title}</a>
                    </h5>
                </div>
            );
        }
        else {
            //parent node
            return (
                <div>
                    <h5 onClick={this.props.nodeToggle} className={ClassNames(cssClasses)}>
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