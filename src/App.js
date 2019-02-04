import React, { Component } from "react";
import WeatherData from "./components/WeatherData";
//dummy data
import Data from "./Data.js";
import "./App.css";
const apiKey = "76519edb8402df02b5fb3c06f42299f5";

class App extends Component {
  state = {
    loading: true,
    isLoaded: false,
    lon: null,
    lat: null,
    data: {},
    cityInput: "",
    countryCode: "",
    error: false,
    geolocation: false
  };
  // api.openweathermap.org/data/2.5/weather?q={city name}&APPID=76519edb8402df02b5fb3c06f42299f5
  //data.cod == 404

  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(this.success, this.fail);
    } else {
      /* geolocation IS NOT available */
      console.log("Geolocation is not supported by your browser");
    }
  }

  success = position => {
    this.setState({
      lon: position.coords.longitude,
      lat: position.coords.latitude
    });
    //dummy loading time
    // setTimeout(this.setData, 5000);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${
        this.state.lat
      }&lon=${this.state.lon}&APPID=${apiKey}&units=metric`
    )
      .then(response => response.json())
      .then(data =>
        data.cod === "404"
          ? this.setState({ error: true })
          : this.setState({ data: data, isLoaded: true })
      );
  };
  setData = () => {
    this.setState({
      loading: false,
      data: Data,
      isLoaded: true,
      geolocation: true
    });
  };
  fail = () => {
    this.setState({
      error: true
    });
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = e => {
    //empty string == false
    e.preventDefault();
    console.log("Submitted");
    if (!this.state.cityInput) {
      console.log("Fill out city input");
    } else {
      if (this.state.cityInput && this.state.countryCode) {
        //set state to Loading
        this.setState({ loading: true });
        //fetch data
        fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${
            this.state.cityInput
          },${this.state.countryCode}&APPID=${apiKey}&units=metric`
        )
          .then(response => response.json())
          .then(data =>
            data.cod === "404"
              ? this.setState({ error: true })
              : this.setState({
                  loading: false,
                  data: data,
                  isLoaded: true,
                  error: false
                })
          );
        //set state to loaded.
      } else {
        //set state to Loading
        this.setState({ loading: true });
        //fetch data
        fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${
            this.state.cityInput
          }&APPID=${apiKey}&units=metric`
        )
          .then(response => response.json())
          .then(data =>
            data.cod === "404"
              ? this.setState({ error: true })
              : this.setState({
                  loading: false,
                  data: data,
                  isLoaded: true,
                  error: false
                })
          );
      }
    }
  };

  render() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    let weather;
    if (this.state.error) {
      weather = (
        <div>
          <p>Whoops. Something when wrong. Please try again.</p>
        </div>
      );
    } else if (this.state.isLoaded) {
      weather = <WeatherData data={this.state.data} />;
    } else if (this.state.loading) {
      weather = <p>Loading...</p>;
    }

    return (
      <div className="main">
        <h1>
          Your local weather at {hours}:{minutes}
        </h1>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.handleChange}
            name="cityInput"
            type="text"
            value={this.state.cityInput}
            placeholder="City"
          />
          <input
            onChange={this.handleChange}
            name="countryCode"
            type="text"
            placeholder="Country code"
            value={this.state.countryCode}
            maxLength="2"
          />
          <input type="submit" />
        </form>
        <>{weather}</>
      </div>
    );
  }
}

export default App;
