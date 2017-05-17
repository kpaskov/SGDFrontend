import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  charset: 'UTF-8',
  'togglable': {
    'color': '#D78770',
    'cursor': 'default'
  },
  'togglable-down::after': {
    'fontSize': [{ 'unit': 'px', 'value': NaN }],
    'marginLeft': [{ 'unit': 'em', 'value': NaN }]
  },
  'togglable-up::after': {
    'fontSize': [{ 'unit': 'px', 'value': NaN }],
    'marginLeft': [{ 'unit': 'em', 'value': NaN }]
  },
  'togglable-down::after': {
    'content': ''▼'',
    'display': ''inline-block''
  },
  'togglable-up::after': {
    'content': ''▶'',
    'display': ''inline-block''
  },
  'ReactTable': {
    'position': 'relative',
    'display': '-webkit-box',
    'display': '-ms-flexbox',
    'display': 'flex',
    'WebkitBoxOrient': 'vertical',
    'WebkitBoxDirection': 'normal',
    'MsFlexDirection': 'column',
    'flexDirection': 'column',
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.1)' }]
  },
  'ReactTable *': {
    'boxSizing': 'border-box'
  },
  'ReactTable rt-table': {
    'WebkitBoxFlex': '1',
    'MsFlex': '1',
    'flex': '1',
    'display': '-webkit-box',
    'display': '-ms-flexbox',
    'display': 'flex',
    'WebkitBoxOrient': 'vertical',
    'WebkitBoxDirection': 'normal',
    'MsFlexDirection': 'column',
    'flexDirection': 'column',
    'WebkitBoxAlign': 'stretch',
    'MsFlexAlign': 'stretch',
    'alignItems': 'stretch',
    'width': [{ 'unit': '%H', 'value': 1 }],
    'borderCollapse': 'collapse',
    'overflow': 'auto'
  },
  'ReactTable rt-thead': {
    'WebkitBoxFlex': '1',
    'MsFlex': '1 0 auto',
    'flex': '1 0 auto',
    'display': '-webkit-box',
    'display': '-ms-flexbox',
    'display': 'flex',
    'WebkitBoxOrient': 'vertical',
    'WebkitBoxDirection': 'normal',
    'MsFlexDirection': 'column',
    'flexDirection': 'column',
    'WebkitUserSelect': 'none',
    'MozUserSelect': 'none',
    'MsUserSelect': 'none',
    'userSelect': 'none'
  },
  'ReactTable rt-thead-headerGroups': {
    'background': 'rgba(0, 0, 0, 0.03)',
    'borderBottom': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.05)' }]
  },
  'ReactTable rt-thead-filters': {
    'borderBottom': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.05)' }]
  },
  'ReactTable rt-thead-filters rt-th': {
    'borderRight': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.02)' }]
  },
  'ReactTable rt-thead-header': {
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 2 }, { 'unit': 'px', 'value': 15 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.15)' }]
  },
  'ReactTable rt-thead rt-tr': {
    'textAlign': 'center'
  },
  'ReactTable rt-thead rt-th': {
    'padding': [{ 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }],
    'lineHeight': [{ 'unit': 'string', 'value': 'normal' }],
    'position': 'relative',
    'borderRight': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.05)' }],
    'WebkitTransition': 'box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'transition': 'box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'boxShadow': [{ 'unit': 'string', 'value': 'inset' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'transparent' }]
  },
  'ReactTable rt-thead rt-td': {
    'padding': [{ 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }],
    'lineHeight': [{ 'unit': 'string', 'value': 'normal' }],
    'position': 'relative',
    'borderRight': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.05)' }],
    'WebkitTransition': 'box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'transition': 'box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'boxShadow': [{ 'unit': 'string', 'value': 'inset' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'transparent' }]
  },
  'ReactTable rt-thead rt-th-sort-asc': {
    'boxShadow': [{ 'unit': 'string', 'value': 'inset' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.6)' }]
  },
  'ReactTable rt-thead rt-td-sort-asc': {
    'boxShadow': [{ 'unit': 'string', 'value': 'inset' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.6)' }]
  },
  'ReactTable rt-thead rt-th-sort-desc': {
    'boxShadow': [{ 'unit': 'string', 'value': 'inset' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': -3 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.6)' }]
  },
  'ReactTable rt-thead rt-td-sort-desc': {
    'boxShadow': [{ 'unit': 'string', 'value': 'inset' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': -3 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.6)' }]
  },
  'ReactTable rt-thead rt-th-cursor-pointer': {
    'cursor': 'pointer'
  },
  'ReactTable rt-thead rt-td-cursor-pointer': {
    'cursor': 'pointer'
  },
  'ReactTable rt-thead rt-th:last-child': {
    'borderRight': [{ 'unit': 'px', 'value': 0 }]
  },
  'ReactTable rt-thead rt-td:last-child': {
    'borderRight': [{ 'unit': 'px', 'value': 0 }]
  },
  'ReactTable rt-thead rt-resizable-header': {
    'overflow': 'visible'
  },
  'ReactTable rt-thead rt-resizable-header:last-child': {
    'overflow': 'hidden'
  },
  'ReactTable rt-thead rt-resizable-header-content': {
    'overflow': 'hidden',
    'textOverflow': 'ellipsis'
  },
  'ReactTable rt-thead rt-header-pivot': {
    'borderRightColor': '#f7f7f7'
  },
  'ReactTable rt-thead rt-header-pivot:after': {
    'left': [{ 'unit': '%H', 'value': 1 }],
    'top': [{ 'unit': '%V', 'value': 0.5 }],
    'border': [{ 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'transparent' }],
    'content': '" "',
    'height': [{ 'unit': 'px', 'value': 0 }],
    'width': [{ 'unit': 'px', 'value': 0 }],
    'position': 'absolute',
    'pointerEvents': 'none'
  },
  'ReactTable rt-thead rt-header-pivot:before': {
    'left': [{ 'unit': '%H', 'value': 1 }],
    'top': [{ 'unit': '%V', 'value': 0.5 }],
    'border': [{ 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'transparent' }],
    'content': '" "',
    'height': [{ 'unit': 'px', 'value': 0 }],
    'width': [{ 'unit': 'px', 'value': 0 }],
    'position': 'absolute',
    'pointerEvents': 'none'
  },
  'ReactTable rt-thead rt-header-pivot:after': {
    'borderColor': 'rgba(255, 255, 255, 0)',
    'borderLeftColor': '#fff',
    'borderWidth': '8px',
    'marginTop': [{ 'unit': 'px', 'value': -8 }]
  },
  'ReactTable rt-thead rt-header-pivot:before': {
    'borderColor': 'rgba(102, 102, 102, 0)',
    'borderLeftColor': '#f7f7f7',
    'borderWidth': '10px',
    'marginTop': [{ 'unit': 'px', 'value': -10 }]
  },
  'ReactTable rt-tbody': {
    'WebkitBoxFlex': '99999',
    'MsFlex': '99999 1 auto',
    'flex': '99999 1 auto',
    'display': '-webkit-box',
    'display': '-ms-flexbox',
    'display': 'flex',
    'WebkitBoxOrient': 'vertical',
    'WebkitBoxDirection': 'normal',
    'MsFlexDirection': 'column',
    'flexDirection': 'column',
    'overflow': 'auto'
  },
  'ReactTable rt-tbody rt-tr-group': {
    'borderBottom': [{ 'unit': 'string', 'value': 'solid' }, { 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.05)' }]
  },
  'ReactTable rt-tbody rt-tr-group:last-child': {
    'borderBottom': [{ 'unit': 'px', 'value': 0 }]
  },
  'ReactTable rt-tbody rt-td': {
    'borderRight': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.02)' }]
  },
  'ReactTable rt-tbody rt-td:last-child': {
    'borderRight': [{ 'unit': 'px', 'value': 0 }]
  },
  'ReactTable rt-tbody rt-expandable': {
    'cursor': 'pointer'
  },
  'ReactTable rt-tr-group': {
    'WebkitBoxFlex': '1',
    'MsFlex': '1 0 auto',
    'flex': '1 0 auto',
    'display': '-webkit-box',
    'display': '-ms-flexbox',
    'display': 'flex',
    'WebkitBoxOrient': 'vertical',
    'WebkitBoxDirection': 'normal',
    'MsFlexDirection': 'column',
    'flexDirection': 'column',
    'WebkitBoxAlign': 'stretch',
    'MsFlexAlign': 'stretch',
    'alignItems': 'stretch'
  },
  'ReactTable rt-tr': {
    'WebkitBoxFlex': '1',
    'MsFlex': '1 0 auto',
    'flex': '1 0 auto',
    'display': '-webkit-inline-box',
    'display': '-ms-inline-flexbox',
    'display': 'inline-flex'
  },
  'ReactTable rt-th': {
    'WebkitBoxFlex': '1',
    'MsFlex': '1 0 0px',
    'flex': '1 0 0',
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',
    'padding': [{ 'unit': 'px', 'value': 7 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 7 }, { 'unit': 'px', 'value': 5 }],
    'overflow': 'hidden',
    'WebkitTransition': '.3s ease',
    'transition': '.3s ease',
    'WebkitTransitionProperty': 'width,min-width,padding,opacity',
    'transitionProperty': 'width,min-width,padding,opacity'
  },
  'ReactTable rt-td': {
    'WebkitBoxFlex': '1',
    'MsFlex': '1 0 0px',
    'flex': '1 0 0',
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',
    'padding': [{ 'unit': 'px', 'value': 7 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 7 }, { 'unit': 'px', 'value': 5 }],
    'overflow': 'hidden',
    'WebkitTransition': '.3s ease',
    'transition': '.3s ease',
    'WebkitTransitionProperty': 'width,min-width,padding,opacity',
    'transitionProperty': 'width,min-width,padding,opacity'
  },
  'ReactTable rt-th-hidden': {
    'width': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }],
    'minWidth': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }],
    'border': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }],
    'opacity': '0 !important'
  },
  'ReactTable rt-td-hidden': {
    'width': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }],
    'minWidth': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }],
    'border': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }],
    'opacity': '0 !important'
  },
  'ReactTable rt-expander': {
    'display': 'inline-block',
    'position': 'relative',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': 'transparent',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }]
  },
  'ReactTable rt-expander:after': {
    'content': '''',
    'position': 'absolute',
    'width': [{ 'unit': 'px', 'value': 0 }],
    'height': [{ 'unit': 'px', 'value': 0 }],
    'top': [{ 'unit': '%V', 'value': 0.5 }],
    'left': [{ 'unit': '%H', 'value': 0.5 }],
    'WebkitTransform': 'translate(-50%, -50%) rotate(-90deg)',
    'transform': 'translate(-50%, -50%) rotate(-90deg)',
    'borderLeft': [{ 'unit': 'px', 'value': 5.04 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'transparent' }],
    'borderRight': [{ 'unit': 'px', 'value': 5.04 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'transparent' }],
    'borderTop': [{ 'unit': 'px', 'value': 7 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.8)' }],
    'WebkitTransition': 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'transition': 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'cursor': 'pointer'
  },
  'ReactTable rt-expander-open:after': {
    'WebkitTransform': 'translate(-50%, -50%) rotate(0)',
    'transform': 'translate(-50%, -50%) rotate(0)'
  },
  'ReactTable rt-resizer': {
    'display': 'inline-block',
    'position': 'absolute',
    'width': [{ 'unit': 'px', 'value': 36 }],
    'top': [{ 'unit': 'px', 'value': 0 }],
    'bottom': [{ 'unit': 'px', 'value': 0 }],
    'right': [{ 'unit': 'px', 'value': -18 }],
    'cursor': 'col-resize',
    'zIndex': '10'
  },
  'ReactTable rt-tfoot': {
    'display': '-webkit-box',
    'display': '-ms-flexbox',
    'display': 'flex',
    'WebkitBoxOrient': 'vertical',
    'WebkitBoxDirection': 'normal',
    'MsFlexDirection': 'column',
    'flexDirection': 'column',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 15 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.15)' }]
  },
  'ReactTable rt-tfoot rt-td': {
    'borderRight': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.05)' }]
  },
  'ReactTable rt-tfoot rt-td:last-child': {
    'borderRight': [{ 'unit': 'px', 'value': 0 }]
  },
  'ReactTable-striped rt-tr-odd': {
    'background': 'rgba(0, 0, 0, 0.03)'
  },
  'ReactTable-highlight rt-tbody rt-tr:not(-padRow):hover': {
    'background': 'rgba(0, 0, 0, 0.05)'
  },
  'ReactTable -pagination': {
    'zIndex': '1',
    'display': '-webkit-box',
    'display': '-ms-flexbox',
    'display': 'flex',
    'WebkitBoxPack': 'justify',
    'MsFlexPack': 'justify',
    'justifyContent': 'space-between',
    'WebkitBoxAlign': 'stretch',
    'MsFlexAlign': 'stretch',
    'alignItems': 'stretch',
    'MsFlexWrap': 'wrap',
    'flexWrap': 'wrap',
    'padding': [{ 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 3 }],
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 15 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.1)' }],
    'borderTop': [{ 'unit': 'px', 'value': 2 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.1)' }]
  },
  'ReactTable -pagination -btn': {
    'WebkitAppearance': 'none',
    'MozAppearance': 'none',
    'appearance': 'none',
    'display': 'block',
    'width': [{ 'unit': '%H', 'value': 1 }],
    'height': [{ 'unit': '%V', 'value': 1 }],
    'border': [{ 'unit': 'px', 'value': 0 }],
    'borderRadius': '3px',
    'padding': [{ 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 6 }],
    'fontSize': [{ 'unit': 'em', 'value': 1 }],
    'color': 'rgba(0, 0, 0, 0.6)',
    'background': 'rgba(0, 0, 0, 0.1)',
    'WebkitTransition': 'all .1s ease',
    'transition': 'all .1s ease',
    'cursor': 'pointer',
    'outline': 'none'
  },
  'ReactTable -pagination -btn[disabled]': {
    'opacity': '.5',
    'cursor': 'default'
  },
  'ReactTable -pagination -btn:not([disabled]):hover': {
    'background': 'rgba(0, 0, 0, 0.3)',
    'color': '#fff'
  },
  'ReactTable -pagination -previous': {
    'WebkitBoxFlex': '1',
    'MsFlex': '1',
    'flex': '1',
    'textAlign': 'center'
  },
  'ReactTable -pagination -next': {
    'WebkitBoxFlex': '1',
    'MsFlex': '1',
    'flex': '1',
    'textAlign': 'center'
  },
  'ReactTable -pagination -center': {
    'WebkitBoxFlex': '1.5',
    'MsFlex': '1.5',
    'flex': '1.5',
    'textAlign': 'center',
    'marginBottom': [{ 'unit': 'px', 'value': 0 }],
    'display': '-webkit-box',
    'display': '-ms-flexbox',
    'display': 'flex',
    'WebkitBoxOrient': 'horizontal',
    'WebkitBoxDirection': 'normal',
    'MsFlexDirection': 'row',
    'flexDirection': 'row',
    'MsFlexWrap': 'wrap',
    'flexWrap': 'wrap',
    'WebkitBoxAlign': 'center',
    'MsFlexAlign': 'center',
    'alignItems': 'center',
    'MsFlexPack': 'distribute',
    'justifyContent': 'space-around'
  },
  'ReactTable -pagination -pageInfo': {
    'display': 'inline-block',
    'margin': [{ 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 10 }],
    'whiteSpace': 'nowrap'
  },
  'ReactTable -pagination -pageJump': {
    'display': 'inline-block'
  },
  'ReactTable -pagination -pageJump input': {
    'width': [{ 'unit': 'px', 'value': 70 }],
    'textAlign': 'center'
  },
  'ReactTable -pagination -pageSizeOptions': {
    'margin': [{ 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 3 }, { 'unit': 'px', 'value': 10 }]
  },
  'ReactTable rt-noData': {
    'display': 'block',
    'position': 'absolute',
    'left': [{ 'unit': '%H', 'value': 0.5 }],
    'top': [{ 'unit': '%V', 'value': 0.5 }],
    'WebkitTransform': 'translate(-50%, -50%)',
    'transform': 'translate(-50%, -50%)',
    'background': 'rgba(255, 255, 255, 0.8)',
    'WebkitTransition': 'all .3s ease',
    'transition': 'all .3s ease',
    'zIndex': '1',
    'pointerEvents': 'none',
    'padding': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }],
    'color': 'rgba(0, 0, 0, 0.5)'
  },
  'ReactTable -loading': {
    'display': 'block',
    'position': 'absolute',
    'left': [{ 'unit': 'px', 'value': 0 }],
    'right': [{ 'unit': 'px', 'value': 0 }],
    'top': [{ 'unit': 'px', 'value': 0 }],
    'bottom': [{ 'unit': 'px', 'value': 0 }],
    'background': 'rgba(255, 255, 255, 0.8)',
    'WebkitTransition': 'all .3s ease',
    'transition': 'all .3s ease',
    'zIndex': '2',
    'opacity': '0',
    'pointerEvents': 'none'
  },
  'ReactTable -loading > div': {
    'position': 'absolute',
    'display': 'block',
    'textAlign': 'center',
    'width': [{ 'unit': '%H', 'value': 1 }],
    'top': [{ 'unit': '%V', 'value': 0.5 }],
    'left': [{ 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'px', 'value': 15 }],
    'color': 'rgba(0, 0, 0, 0.6)',
    'WebkitTransform': 'translateY(-52%)',
    'transform': 'translateY(-52%)',
    'WebkitTransition': 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'transition': 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  'ReactTable -loading-active': {
    'opacity': '1',
    'pointerEvents': 'all'
  },
  'ReactTable -loading-active > div': {
    'WebkitTransform': 'translateY(50%)',
    'transform': 'translateY(50%)'
  },
  'ReactTable input': {
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.1)' }],
    'background': '#fff',
    'padding': [{ 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 7 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 7 }],
    'fontSize': [{ 'unit': 'string', 'value': 'inherit' }],
    'borderRadius': '3px',
    'fontWeight': 'normal',
    'outline': 'none'
  },
  'ReactTable select': {
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.1)' }],
    'background': '#fff',
    'padding': [{ 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 7 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 7 }],
    'fontSize': [{ 'unit': 'string', 'value': 'inherit' }],
    'borderRadius': '3px',
    'fontWeight': 'normal',
    'outline': 'none'
  },
  'ReactTable input:not([type="checkbox"]):not([type="radio"])': {
    'WebkitAppearance': 'none',
    'MozAppearance': 'none',
    'appearance': 'none'
  },
  'ReactTable select': {
    'WebkitAppearance': 'none',
    'MozAppearance': 'none',
    'appearance': 'none'
  },
  'ReactTable select-wrap': {
    'position': 'relative',
    'display': 'inline-block'
  },
  'ReactTable select-wrap select': {
    'padding': [{ 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 15 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 7 }],
    'minWidth': [{ 'unit': 'px', 'value': 100 }]
  },
  'ReactTable select-wrap:after': {
    'content': '''',
    'position': 'absolute',
    'right': [{ 'unit': 'px', 'value': 8 }],
    'top': [{ 'unit': '%V', 'value': 0.5 }],
    'WebkitTransform': 'translate(0, -50%)',
    'transform': 'translate(0, -50%)',
    'borderColor': '#999 transparent transparent',
    'borderStyle': 'solid',
    'borderWidth': '5px 5px 2.5px'
  },
  'ReactTable rt-resizing rt-th': {
    'WebkitTransition': 'none !important',
    'transition': 'none !important',
    'cursor': 'col-resize',
    'WebkitUserSelect': 'none',
    'MozUserSelect': 'none',
    'MsUserSelect': 'none',
    'userSelect': 'none'
  },
  'ReactTable rt-resizing rt-td': {
    'WebkitTransition': 'none !important',
    'transition': 'none !important',
    'cursor': 'col-resize',
    'WebkitUserSelect': 'none',
    'MozUserSelect': 'none',
    'MsUserSelect': 'none',
    'userSelect': 'none'
  }
});
