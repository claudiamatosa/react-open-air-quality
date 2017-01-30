import React from 'react';

/*
  Format of props.data:

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
function MeasurementDetails(props) {
  const measurementData = props.data;

  return (
    <div className="app-country-statistics">
      <strong>Last measurement for country: </strong>{measurementData.country}<br/>
      <strong>City: </strong>{measurementData.city}<br/>
      <strong>Parameter measured: </strong>{measurementData.parameter}<br/>
      <strong>Result: </strong>{measurementData.value} {measurementData.unit}<br/>
    </div>
  )
}

export default MeasurementDetails;
