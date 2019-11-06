import React from "react";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromCity: "",
      isFromCityValid: true,
      toCities: [],
      isToCitiesValid: true
    };
  }

  handleOnChangeFromCity = event => {
    this.setState({
      fromCity: event.target.value
    });
  };
  handleOnChangeToCities = (event, value) => {
    this.setState({
      toCities: value
    });
  };
  onSearchClick = () => {
    const { fromCity, toCities } = this.state;
    const isFromCityValid = fromCity !== "";
    const isToCitiesValid = toCities.length > 0;
    this.setState({
      isFromCityValid,
      isToCitiesValid
    });
    if (isFromCityValid && isToCitiesValid) {
      this.props.handleSearch({
        toCities,
        fromCity
      });
    }
  };

  renderTags = (value, { className, onDelete }) => {
    return value.map((option, index) => (
      <Chip
        key={index}
        variant="outlined"
        data-tag-index={index}
        tabIndex={-1}
        label={option}
        onDelete={onDelete}
      />
    ));
  };
  render() {
    const {
      handleOnChangeFromCity,
      handleOnChangeToCities,
      onSearchClick
    } = this;
    const { isFromCityValid, isToCitiesValid } = this.state;
    return (
      <React.Fragment>
        <Grid
          container
          className="search-container"
          direction="row"
          alignItems="center"
          justify="center"
          spacing={2}
        >
          <Grid item xs={12} sm={5}>
            <TextField
              error={!isFromCityValid}
              data-testid="fromCityInput"
              label="From city"
              fullWidth
              className="input"
              variant="outlined"
              onChange={handleOnChangeFromCity}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Autocomplete
              multiple
              freeSolo
              data-testid="toCitiesInput"
              renderTags={this.renderTags}
              onChange={handleOnChangeToCities}
              renderInput={params => (
                <TextField
                  {...params}
                  error={!isToCitiesValid}
                  fullWidth
                  className="input"
                  variant="outlined"
                  label="To Cities"
                />
              )}
            />
          </Grid>
          <Grid item>
            <Fab color="primary" aria-label="like" onClick={onSearchClick}>
              <SearchIcon />
            </Fab>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
export default SearchBox;
