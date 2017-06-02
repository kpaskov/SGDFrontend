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
import DataTable from '../components/widgets/data_table.jsx'
import S from 'string';
import _ from 'underscore';


const DOWNLOADS_URL = '/downloads';

class CustomTreeContainer extends Component {
    constructor(props) {
        super(props);
        this.leafClick = this.leafClick.bind(this);
        this.nodeToggle = this.nodeToggle.bind(this);
        this.getSelectedNode = this.getSelectedNode.bind(this);
        this.fetchSelectedNodes = this.fetchSelectedNodes.bind(this);

    }
    renderDataTable(data) {
        debugger;
        let results = { headers: [], rows: [] };
        if (data) {
            results.rows.push(data.datasets.map((item, index) => {
                let arr = []
                arr.push(item.download_href);
                arr.push(item.name);
                arr.push(item.description);
                arr.push(item.readme_href);
                return arr;
            }));
            results.headers.push(Object.keys(data.datasets[0])
                .map((item, index) => {
                    if (item.indexOf('readme') !== -1) {
                        return 'ReadMe'
                    }
                    else if (item.indexOf('download') !== -1) {
                        return 'Download'
                    }
                    else {
                        return S(item).capitalize().s
                    }
                }));

            return results;
        }
    }
    fetchSelectedNodes() {
        //return    
    }

    nodeToggle(node) {

        console.log('toggle node: ', event.target);
        this.props.dispatch(downloadsActions.toggleNode(!this.props.isVisible));
        //this.props.dispatch();
    }

    fetchDownloads(term) {
        this.props.dispatch(downloadsActions.fetchDownloadResults(term));
    }


    leafClick(event) {
        this.fetchDownloads(event.target.id)
        this.props.history.pushState(null, DOWNLOADS_URL, { q: event.target.id });

    }

    getSelectedNode(node) {

        this.props.dispatch(downloadsActions.getNode(node));
    }

    componentDidMount() {
        this.props.dispatch(downloadsActions.fetchDownloadsMenuData());
        if (this.props.query.length > 0) {
            this.props.dispatch(downloadsActions.fetchDownloadResults(this.props.query));
        }

    }

    setTable(data) {
        let results = { columns: [], tableInfo: [] };
        if (data) {
            results.tableInfo = data.datasets.map((item, index) => {
                return { download: item.download_href, name: item.name, description: item.description, readme: item.readme_href };
            });
            results.columns = results.columns
                .concat(Object.keys(data.datasets[0]))
                .map((item, index) => {
                    if (item.indexOf('readme') !== -1) {
                        return {
                            Header: 'ReadMe',
                            accessor: 'readme',
                            Cell: props => <span><i className='fa fa-file-text-o' aria-hidden='true'></i></span>,
                            style: { 'color': '#CCD2D7' }

                        };
                    }
                    else if (item.indexOf('download') !== -1) {
                        return {
                            Header: 'Download',
                            accessor: 'download',
                            Cell: props => <span><i className='fa fa-cloud-download' aria-hidden="true"></i></span>,
                            style: { color: '#AA0000' }
                        };
                    }
                    else {
                        return {
                            Header: S(item).capitalize().s,
                            accessor: item.toLowerCase()
                        };
                    }
                });
        }
        return results;
    }
    renderTreeStructure() {

        let items = this.props.downloadsMenu;
        if (items.length > 0) {
            let treeNodes = items.map((node, index) => {
                if (node) {
                    return <CustomTree key={index} node={node} leafClick={this.leafClick}
                        nodeClick={this.getSelectedNode} queryString={this.props.query.q} />
                }
            });
            return treeNodes;
        }
        else {
            return [];
        }

    }

    render() {

        let data = this.renderTreeStructure();
        if (Object.keys(this.props.downloadsResults).length > 0) {
            let table = this.renderDataTable(this.props.downloadsResults);
            let renderTemplate = (<div className="row">
                <div className="columns small-4">{data}</div>
                <div className="columns small-8">
                    <DataTable data={table} usePlugin={true} />
                </div>
            </div>);
            return renderTemplate;
        }
        else {
            let renderTemplate = (<div className="row">
                <div className="columns small-4">{data}</div>
            </div>);
            return renderTemplate;
        }
    }

}


function mapStateToProps(state) {
    return {
        downloadsMenu: state.downloads.downloadsMenu,
        downloadsResults: state.downloads.downloadsResults,
        query: state.downloads.query,
        selectedLeaf: state.downloads.selectedLeaf,
        url: `${state.routing.location.pathname}${state.routing.location.search}`,
        queryParams: state.routing.location.query,
        nodeVisible: state.downloads.nodeVisible,
    }

}


export default connect(mapStateToProps)(CustomTreeContainer);
/* renderTable() {
       
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

        if (this.props.downloadsResults.tableInfo) {
            return (<ReactTable
                data={this.props.downloadsResults.tableInfo}
                columns={this.props.downloadsResults.columns}
            />);
        }
        else {
            return (<ReactTable
                data={info}
                columns={columns}
            />);
        }


    }*/
