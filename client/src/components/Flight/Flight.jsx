import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/CardContent";

import "./Flight.css";

class Flight extends React.Component {
  render() {
    const {flight} = this.props;
    return (
        <Card className="flight-container">
          <CardMedia
            className='media'
            heigth="140"
            image="/flight.jpg"
          />
          <CardContent className="flight-content">
          <Typography variant="h5" component="h2">
            {flight.city}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {flight.cost}
          </Typography>
          </CardContent>
      </Card>
    );
  }
}

export default Flight;
