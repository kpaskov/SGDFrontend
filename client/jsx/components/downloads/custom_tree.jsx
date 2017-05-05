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
        this.state = { visible: true };
    }
    toggle() {
        this.setState({ visible: !this.state.visible });
    }
    render() {
        let childNodes;
        let style;
        let cssClasses;

        if (this.props.node.childNodes != undefined) {
            childNodes = this.props.node.childNodes.map((node, index) => {
                return (<li key={index}><CustomTree node={node} /> </li>)
            });
            cssClasses = {
                'togglable': true,
                'togglable-down': this.state.visible,
                'togglable-up': !this.state.visible
            };

        }
        if (this.state.visible) {
            style = { display: 'none' };
        }
        if (this.props.node.childNodes == undefined) {
            return (
                <div>
                    <h5 className={ClassNames(cssClasses)}>
                        <a>{this.props.node.title}</a>
                    </h5>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h5 className={ClassNames(cssClasses)}>
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