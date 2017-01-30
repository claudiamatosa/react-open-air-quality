import React, { Component } from 'react';
import logo from './images/cyf.png';
import './styles/App.css';
import CountriesList from './components/CountriesList';
import MeasurementDetails from './components/MeasurementDetails';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Populates the dropdown box ("CountriesList" component)
      countriesList: [],
      // When a country is selected, contains the last measurement ("MeasurementDetails" component)
      measurementData: null,
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
    this.getCountryStatistics(this.state.selectedCountry);
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

        {(
          // If there is no measurement data, we want to display "Select a country, please".
          this.state.measurementData ?
          <MeasurementDetails data={this.state.measurementData} /> :
          <div>Select a country please.</div>
        )}
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

  /*
    Load the statistics for the given country code and limit to pollutants co and pm25.

    The response will come as an object, containing an array of "results". We will select
    the first result and save it to this.state.measurementData.

    Full response: https://api.openaq.org/v1/measurements?country=IN
  */
  getCountryStatistics(countryCode) {
    // If there is no country selected, we do not make a call to the API
    if(countryCode === '-1' || countryCode === undefined) return;

    const url = `https://api.openaq.org/v1/measurements?country=${countryCode}&parameter[]=co&parameter[]=pm25`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // The data comes back as an object with an array called "results".
        // We take the first element of this array, as it contains our measurement data.
        this.setState({ measurementData: data.results[0] });
    });
  }
}

export default App;
