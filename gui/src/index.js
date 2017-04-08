import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  appBar: {
    height: 48
  }

});

const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
        <Main />
  </MuiThemeProvider>
);


ReactDOM.render(
  <App />,
  document.getElementById('app')
);