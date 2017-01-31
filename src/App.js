import React, { Component } from 'react';
import logo from './images/cyf.png';
import './styles/App.css';
import CountriesList from './components/CountriesList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Populates the dropdown box ("CountriesList" component)
      countriesList: [],
      // We are reading the route parameters here too, so we can fill the dropdown
      // boxes with the information we get from the url.
      //
      // For example: Navigating to /country/AR will fill the country
      // dropdown box with "Argentina". (Launch the server and give it a try!)
      selectedCountry: props.params.countryCode,
    }
  }

  componentDidMount() {
    // Let's start by populating the dropdown box.
    this.getCountriesList();
  }

  /*
    This event occurs when the user selects a country in the dropdown box.

    Details:
    event.target: the <select> DOM element
    event.target.value: contents of the "value" attribute.

    Example: in <select value="IN">, event.target.value is IN.
  */
  onCountryChange = (event) => {
    this.setState({ selectedCountry: event.target.value });
  }

  /*
    The user clicked the button. We want to get the measurements for the
    country that was selected in the dropdown box. We stored it in the state,
    during "onCountryChange".
  */
  onSubmitCountry = () => {
    // Instead of updating the data ourselves, we navigate to a url that contains
    // the countryCode. The MeasurementDetails component will take care of the rest!
    const destinationUrl = `/country/${this.state.selectedCountry}`;

    // "router" is a special prop given to App by react-router. It allows doing several
    // things, including navigating between pages.
    //
    // Using "push" will change the url without refreshing.
    this.props.router.push(destinationUrl);
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h2>Air quality checker</h2>
        </div>

        <div className="app-search-box">
          <div>
            <CountriesList
              countries={this.state.countriesList}
              onCountryChange={this.onCountryChange}
            />
          </div>

          <div>
            <button onClick={this.onSubmitCountry} type="submit">
              Retrieve last air quality measurement
            </button>
          </div>
        </div>

        {/* The component in the routes.js file will go here. */}
        { this.props.children }
      </div>
    );
  }

  /*
    We get a list of all the countries available in the Open Air Quality API.

    They will arrive as an object, with an array of "results", containing {
      name,
      code,
      cities,
      locations,
      count
    }

    We will save this array to this.state.countriesList.

    Full response: https://api.openaq.org/v1/countries
  */
  getCountriesList() {
    const countryURL = 'https://api.openaq.org/v1/countries';

    fetch(countryURL)
      .then(response => response.json())
      .then(data => {
        this.setState({ countriesList: data.results });
      });
  }
}

export default App;
