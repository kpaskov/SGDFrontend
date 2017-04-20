import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // **********************************************
Layout rules - SMACSS 
http://smacss.com/book/type-layout
***********************************************
  '#layout-document': {
    'overflow': 'hidden',
    'paddingBottom': [{ 'unit': 'px', 'value': 92 }],
    'marginTop': [{ 'unit': 'rem', 'value': 1 }],
    'only screen&&<w47.5': {
      'paddingBottom': [{ 'unit': 'px', 'value': 250 }],
      'marginTop': [{ 'unit': 'px', 'value': 0 }]
    }
  },
  '#contentbody-responsive': {
    'overflow': 'hidden',
    'paddingBottom': [{ 'unit': 'px', 'value': 92 }],
    'marginTop': [{ 'unit': 'rem', 'value': 1 }],
    'only screen&&<w47.5': {
      'paddingBottom': [{ 'unit': 'px', 'value': 250 }],
      'marginTop': [{ 'unit': 'px', 'value': 0 }]
    }
  },
  '#content': {
    'overflow': 'hidden',
    'paddingBottom': [{ 'unit': 'px', 'value': 92 }],
    'marginTop': [{ 'unit': 'rem', 'value': 1 }],
    'only screen&&<w47.5': {
      'paddingBottom': [{ 'unit': 'px', 'value': 250 }],
      'marginTop': [{ 'unit': 'px', 'value': 0 }]
    }
  },
  '#content': {
    'overflow': 'visible'
  },
  '#content': {
    'paddingBottom': [{ 'unit': 'px', 'value': 120 }]
  },
  // Main page header, with global navigation
  '#layout-page-header': {
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  '#layout-page-header-content': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'height': [{ 'unit': 'px', 'value': 90 }]
  },
  '#layout-page-header-nav': {
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'explore-btn': {
    'background': '#D4001F'
  },
  'explore-btn:hover': {
    'background': '#65000C'
  },
  'news-container': {
    'paddingTop': [{ 'unit': 'rem', 'value': 1 }],
    'minHeight': [{ 'unit': 'rem', 'value': 30 }],
    'background': '#EBEBEB'
  },
  // PAGE FOOTER
  '#layout-document-footer': {
    'padding': [{ 'unit': 'px', 'value': 22 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 22 }, { 'unit': 'px', 'value': 0 }],
    'position': 'absolute',
    'bottom': [{ 'unit': 'px', 'value': 0 }],
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'content-column section': {
    'marginBottom': [{ 'unit': 'rem', 'value': 2 }]
  },
  'content-column section:last-child': {
    'borderBottom': [{ 'unit': 'string', 'value': 'none' }]
  }
});
