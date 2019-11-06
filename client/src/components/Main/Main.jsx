import React from "react";
import API from "../../utils/Api.js";
import SearchBox from "../SearchBox/SearchBox.jsx";
import Flight from "../Flight/Flight.jsx";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import qs from "qs";
import { Typography } from "@material-ui/core";

class Main extends React.Component {
  state = {
    fetched: false,
    loading: false,
    errorMsg: "",
    isFound: false,
    fromCity: "",
    toCities: [],
    flight: {
      city: "",
      cost: ""
    }
  };
  handleSearch = async ({ fromCity, toCities }) => {
    this.setState({
      loading: true,
      fetched: false,
      isFound: false
    });
    try {
      const { data } = await API.get("/flight-optimizer", {
        params: {
          from: fromCity,
          to: toCities
        },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      });
      if (!data.found) {
        this.setState({
          loading: false,
          fetched: true,
          errorMsg: "Sorry, no flight was found :c"
        });
        return;
      }
      this.setState({
        flight: {
          city: data.flight.city,
          cost: data.flight.cost
        },
        loading: false,
        isFound: true,
        fetched: true
      });
    } catch (e) {
      this.setState({
        fetched: true,
        loading: false,
        errorMsg: e.response ? e.response.data : "Something went wrong"
      });
    }
  };
  renderContent = () => {
    const { flight, loading, fetched, isFound, errorMsg } = this.state;
    if (loading) {
      return <CircularProgress />;
    }
    if (fetched) {
      return isFound ? (
        <Fade in={fetched}>
          <Flight flight={flight} />
        </Fade>
      ) : (
        <Typography variant="h4" color="error">
          {errorMsg}
        </Typography>
      );
    }
    return null;
  };
  render() {
    return (
      <Container className="MainScreen">
        <Box mt={5} mb={5} textAlign="center">
          <Typography variant="h3">Flight Optimizer</Typography>
        </Box>
        <Box mt={5} mb={5} textAlign="center">
          <Typography variant="h4">
            Save your money and find cheepest flight
          </Typography>
        </Box>
        <Box mb={5} display="flex" justifyContent="center">
          <SearchBox
            handleOnChangeFromCity={this.onChangeFromCity}
            handleOnChangeToCities={value => this.onChangeToCities(value)}
            handleSearch={this.handleSearch}
          />
        </Box>
        <Box mb={5} display="flex" justifyContent="center">
          {this.renderContent()}
        </Box>
      </Container>
    );
  }
}

export default Main;
