import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  charset: 'UTF-8',
  'togglable': {
    'cursor': 'default',
    'fontWeight': 'bold'
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
    'display': ''inline-block'',
    'marginLeft': [{ 'unit': 'px', 'value': 3 }]
  },
  'togglable-up::after': {
    'content': ''▶'',
    'display': ''inline-block'',
    'marginLeft': [{ 'unit': 'px', 'value': 3 }]
  },
  'highlight-node': {
    'backgroundColor': '#cac5d2'
  }
});
