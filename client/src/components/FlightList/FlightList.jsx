import React from "react";
import { Grid } from "@material-ui/core";
import Flight from "../Flight/Flight.jsx"

class FlightList extends React.Component {
  render() {
    const { flights } = this.props;
    return (
      <Grid
        container
        spacing={2}
        display="flex"
        justify="center"
        alignItems="center"
      >
        {flights.map(flight => (
          <Grid item xs={12} md={7} key={flight.to}>
            <Flight flight={flight} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default FlightList;
