import React from "react";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider
} from "@material-ui/core/styles";
import Main from "./Main/Main.jsx";

let theme = createMuiTheme({
  typography: {
    htmlFontSize: 20,
    fontFamily: "Fredoka One, cursive"
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
