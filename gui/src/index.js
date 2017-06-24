import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {
  cyan500, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

injectTapEventPlugin();


const muiTheme = getMuiTheme({
    //ea1c30
    palette: {
    primary1Color: '#ea1c30',
    primary2Color: cyan500,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  },
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
  <App />
  , document.getElementById('app')
);
