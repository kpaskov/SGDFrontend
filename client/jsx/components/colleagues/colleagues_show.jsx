import React from 'react';
var createReactClass = require('create-react-class');
import Radium from 'radium';
import { connect } from 'react-redux';

import ColleaguesFormShow from './colleagues_form_show.jsx';

const ColleaguesShow = createReactClass({
  render () {
    return (
      <div style={[style.container]}>
        <ColleaguesFormShow
          isReadOnly={true} isCurator={false} 
          colleagueDisplayName={this.props.routeParams.formatName}
        />
        <a className='button secondary small' href='/colleague_update'>Update Colleague</a>
      </div>
    );
  }
});

const style = {
  container: {
    marginBottom: '2rem'
  }
};

function mapStateToProps(_state) {
  return {
  };
}

export default connect(mapStateToProps)(Radium(ColleaguesShow));
