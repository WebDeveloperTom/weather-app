import React, { Component } from "react";

class WeatherData extends Component {
  render() {
    const { main, weather, name, sys } = this.props.data;
    return (
      <div>
        <p>
          Weather data for {name}, {sys.country}
        </p>
        <p>{main.temp}^C</p>
        <p>{weather[0].main}</p>
        <p>{weather[0].description}</p>
      </div>
    );
  }
}

export default WeatherData;
