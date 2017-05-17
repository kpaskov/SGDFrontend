/**
 * author: fgondwe
 * date: 05/05/2017
 * purpose: manage state for custom tree component
 */
import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomTree from '../components/downloads/custom_tree.jsx';
import { getTreeData } from '../lib/downloads_temp_helper';
import * as downloadsActions from '../actions/downloads_actions';
import ReactTable from 'react-table';


class CustomTreeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedLeaf: '', treeData: [] };
        this.leafClick = this.leafClick.bind(this);

    }
    leafClick(event) {
        this.props.dispatch(downloadsActions.fetchDownloadResults(event.target.id));
        this.setState({ selectedLeaf: event.target.id });
    }

    componentDidMount() {
        this.props.dispatch(downloadsActions.fetchDownloadsMenuData());
        if (this.props.downloads.downloadsMenu.length > 0) {
            this.setState({ treeData: this.props.downloads.downloadsMenu });
        }

    }
    renderTreeStructure() {
        let items = this.props.downloads.downloadsMenu;
        if (items.length > 0) {
            let treeNodes = items.map((node, index) => {
                if (node) {
                    return <CustomTree key={index} node={node} leafClick={this.leafClick} />
                }
            });
            return treeNodes;
        }
        else {
            return [];
        }

    }
    renderTable() {
        const info = [
            {
                name: 'Travis',
                age: 26,
                friend: {
                    name: 'Jason Maurer',
                    age: 23,
                }
            },
            {
                name: 'Pedro',
                age: 26,
                friend: {
                    name: 'Jason Maurer',
                    age: 23,
                }
            }
        ];
        const columns = [
            {
                Header: 'Name',
                accessor: 'name' // String-based value accessors!
            }, {
                Header: 'Age',
                accessor: 'age',
                Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }, {
                id: 'friendName', // Required because our accessor is not a string
                Header: 'Friend Name',
                accessor: d => d.friend.name // Custom value accessors!
            }, {
                Header: props => <span>Friend Age</span>, // Custom header components!
                accessor: 'friend.age'
            }
        ];
        return (<ReactTable
            data={info}
            columns={columns}
        />);

    }
    render() {
        debugger
        let data = this.renderTreeStructure();
        let table = this.renderTable();
        let renderTemplate = (<div className="row">
            <div className="columns medium-4">{data}</div>
            <div className="columns medium-8">{table}</div>
        </div>);

        return data ? renderTemplate : (<div></div>)
    }

}


function mapStateToProps(state) {
    // console.log('mapping state to props: ', state);
    return state;
}


export default connect(mapStateToProps)(CustomTreeContainer);
