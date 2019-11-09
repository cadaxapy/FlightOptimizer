import React from "react";
import { Box, Card, Typography } from "@material-ui/core";
import "./Flight.css";

class Flight extends React.Component {
  renderLabel = () => {
    const { cheapest } = this.props.flight;
    if (!cheapest) {
      return <Box p={2} />;
    }
    return (
      <Box p={1} className="flight-label-item" fontWeight="bold" fontSize={14}>
        Cheapest
      </Box>
    );
  };
  render() {
    const { flight } = this.props;
    return (
      <Card className="flight-container">
        <Box display="flex" justifyContent="center">
          {this.renderLabel()}
        </Box>
        <Box m={2} display="flex" alignItems="center" flexDirection="column">
          <Box
            width={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">{flight.from}</Typography>
            <hr className="line" />
            <Typography variant="h6">{flight.to}</Typography>
          </Box>
          {flight.found ? (
            <Typography>{`${flight.cost}$/km`}</Typography>
          ) : (
            <Typography>No flight was found :c</Typography>
          )}
        </Box>
      </Card>
    );
  }
}

export default Flight;
