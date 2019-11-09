import React from "react";
import API from "../../utils/Api.js";
import {
  Container,
  CircularProgress,
  Box,
  Typography
} from "@material-ui/core";
import SearchBox from "../SearchBox/SearchBox.jsx";
import FlightList from "../FlightList/FlightList.jsx";
import qs from "qs";

class Main extends React.Component {
  state = {
    fetched: false,
    loading: false,
    errorMsg: "",
    isFound: false,
    flights: []
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
          // By default axios send query arrays as key[]=val&key[]=val2,
          // But in our API arrays need to be key=val&key=val2
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      });
      this.setState({
        flights: data.flights,
        loading: false,
        isFound: true,
        fetched: true
      });
    } catch (e) {
      this.setState({
        fetched: true,
        loading: false,
        errorMsg: e.response ? e.response.data.error : "Something went wrong"
      });
    }
  };
  renderContent = () => {
    const { flights, loading, fetched, isFound, errorMsg } = this.state;
    if (loading) {
      return <CircularProgress />;
    }
    if (fetched) {
      if (!isFound) {
        return (
          <Typography variant="h4" color="error">
            {errorMsg}
          </Typography>
        );
      }
      return <FlightList flights={flights} />;
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
            Save your money and find cheapest flight
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
