import React from "react";
import Main from "./Main/Main.jsx";
import "./App.css";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider
} from "@material-ui/core/styles";
let theme = createMuiTheme({
  typography: {
    htmlFontSize: 16,
    fontFamily: "Ubuntu"
  },
});
theme = responsiveFontSizes(theme);

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    );
  }
}

export default App;
