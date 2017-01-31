import React from 'react';

class MeasurementDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      measurementData: null,
      isFetchingData: false,
      isFetchError: false,
    }
  }

  render() {
    const measurementData = this.state.measurementData;
    const isFetchingData = this.state.isFetchingData;
    const isFetchError = this.state.isFetchError;

    if (isFetchingData) {
      // We are calling the API and waiting until it responds.
      return this.renderIsFetchingMessage();
    } else if (isFetchError) {
      // The API responded with an error.
      return this.renderErrorMessage();
    } else if (measurementData) {
      // The API responded, we have the data. Let's display it in the page!
      return this.renderMeasurementData(this.state.measurementData);
    } else {
      // The API responded, but there is no data available for this country.
      return this.renderNoDataMessage();
    }
  }

  /*
    Format of measurementData:

    {
      location: "Sidhu Kanhu Indoor Stadium, Durgapur - WBSPCB",
      parameter: "no2",
      date:	{
        utc: "2025-08-02T08:30:00.000Z",
        local: "2025-08-02T14:00:00+05:30"
      },
      value: 108.85,
      unit: "µg/m³",
      country: "IN",
      city: "Durgapur",
    }
  */
  renderMeasurementData(measurementData) {
    return (
      <div className="app-measurement-data">
        <strong>Last measurement for country: </strong>{measurementData.country}<br/>
        <strong>City: </strong>{measurementData.city}<br/>
        <strong>Parameter measured: </strong>{measurementData.parameter}<br/>
        <strong>Result: </strong>{measurementData.value} {measurementData.unit}<br/>
      </div>
    );
  }

  renderIsFetchingMessage() {
    return (
      <div className="app-country-fetching">
        Loading data...
      </div>
    );
  }

  renderNoDataMessage() {
    return (
      <div className="app-country-no-data">
        There is no data for this country.
      </div>
    );
  }

  renderErrorMessage() {
    return (
      <div className="app-country-instructions">
        There was an error while fetching the statistics.
      </div>
    );
  }

  componentDidMount() {
    this.getCountryStatistics();
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.params.countryCode !== this.props.params.countryCode
    ) {
      // The address bar has been updated and we need to load the statistics for
      // the newly selected country.
      this.getCountryStatistics();
    }
  }

  /*
    Load the statistics for the given country code and limit to pollutants co and pm25.

    The response will come as an object, containing an array of "results". We will select
    the first result and save it to this.state.measurementData.

    Full response: https://api.openaq.org/v1/measurements?country=IN
  */
  getCountryStatistics() {
    /*
      Params will come from the Route, and will be an object consisting of { countryCode, year }.

      Example:
      {
        countryCode: PT,
      }
    */
    const params = this.props.params;
    const countryCode = params.countryCode;

    // If there is no country selected, we do not make a call to the API
    if(countryCode === '-1' || countryCode === undefined) return;

    const url = `https://api.openaq.org/v1/measurements?country=${countryCode}&parameter[]=co&parameter[]=pm25`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          // The data comes back as an object with an array called "results".
          // We take the first element of this array, as it contains our measurement data.
          measurementData: data.results[0],
          isFetchingData: false,
        });
      })
      .catch(() => {
        // There was an error when fetching the data. The component needs to know
        // this so it can remove the "Loading" message.
        this.setState({
          isFetchingData: false,
          isFetchError: true,
        });
      });;
  }
}

export default MeasurementDetails;
