import React, { useState, useEffect } from 'react';

// Define lineColors object before the getLineColor function
const lineColors = {
  Bakerloo: '#FF0000', // Red
  Central: '#0000FF', // Blue
  Circle: '#FFFF00', // Yellow
  District: '#008000', // Green
  'Hammersmith & City': '#FFC0CB', // Pink
  Jubilee: '#808080', // Gray
  Metropolitan: '#800080', // Purple
  Northern: '#000000', // Black
  Piccadilly: '#00008B', // Dark Blue
  Victoria: '#ADD8E6', // Light Blue
  'Waterloo & City': '#008080', // Teal
};

/*function called getLineColor that takes in a lineName parameter. It returns the color associated with the lineName from the lineColors object. If the lineName is not found in lineColors, it returns the color 'black' as a default.*/
const getLineColor = (lineName) => {
  return lineColors[lineName] || 'black'; // Default to black if the lineName is not found in lineColors
};

/*The StationSearch component is responsible for rendering the search input and select elements for the "From" and "To" stations. It also filters the station names based on the user input and updates the state accordingly.The StationSearch component receives props like label, stationNames, value, and onChange to customize its behavior.*/
function StationSearch({ label, stationNames, value, onChange }) {
  const [filteredStations, setFilteredStations] = useState(stationNames);

  /*handleInputChange that is triggered when an input field changes. It retrieves the value of the input field, filters an array of stationNames based on the input value, sets the filtered array as the state of filteredStations, and calls the onChange function with the input value as an argument.*/
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const filteredStations = stationNames.filter((stationName) =>
      stationName.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredStations(filteredStations);
    onChange(inputValue);
  };

  return (
    <>
      <label htmlFor={`${label}-station-search`} className="block font-bold mt-4 text-gray-500">
        {label}:
      </label>
      <input
        type="text"
        id={`${label}-station-search`}
        value={value}
        onChange={handleInputChange}
        className="block w-full py-2 px-3 border border-rose-400 rounded-md mt-1 text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
        placeholder={`Search ${label} station`}
      />
      {filteredStations.length > 0 && (
        <select
          className="block w-full py-2 px-3 border border-rose-400 rounded-md mt-1 text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select {label} station</option>
          {filteredStations.map((stationName) => (
            <option key={stationName} value={stationName}>
              {stationName}
            </option>
          ))}
        </select>
      )}
    </>
  );
}

/*The JourneyDetails component displays the journey details, including the start and end stations, line name, start time, arrival time, duration, price, platform, and alternative journeys. It uses the lineIdToNameMap to convert the lineId to a line name. The component also renders a visual representation of the journey route using SVG elements.*/
function JourneyDetails({ journeyDetails, lineIdToNameMap }) {
  const getLineName = (lineId) => {
    return lineIdToNameMap[lineId] || 'Unknown Line';
  };

  const lineChangesText = journeyDetails?.route?.length > 1 ? 'Line Changes' : 'No line changes for this route.';
  const platformText = journeyDetails?.platform ? `Platform: ${journeyDetails.platform}` : 'Platform: Unknown';
  const directLineText = journeyDetails?.directLine ? `Direct Line: ${journeyDetails.directLine}` : 'No direct line available for this route.';

  return (
    <div>
      <h2 className="text-xl font-bold mt-6 mb-2 text-gray-600">Journey Details</h2>
      <p>From: {journeyDetails.fromStation}</p>
      <p>To: {journeyDetails.toStation}</p>
      <p>Line Name: {getLineName(journeyDetails.lineName)}</p>
      <p>Start Time: {journeyDetails.startDateTime}</p>
      <p>Arrival Time: {journeyDetails.arrivalTime}</p>
      <p>Duration: {journeyDetails.duration}min</p>
      <p>Price: £{journeyDetails.price}</p>

      {/* Display direct line if available */}
      {journeyDetails.directLine && (
        <div>
          <h2 className="text-xl font-bold mt-6 mb-2 text-gray-600">Direct Line</h2>
          <p>{directLineText}</p>
        </div>
      )}

      {/* Display platform number */}
      <div>
        <h2 className="text-xl font-bold mt-6 mb-2 text-gray-600">Platform</h2>
        <p>{platformText}</p>
      </div>

      {/* Wrapper div to allow vertical scrolling */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
        {/* Display the journey with lines between stations */}
        {journeyDetails.route && (
          <div className="flex-1 md:ml-6">
            <h2 className="text-xl font-bold mb-2">Journey Route</h2>
            {/* Adjusted height of the SVG */}
            <svg className="mt-0" width="100%" height={200 * (journeyDetails.route.length + 1)}>
              {journeyDetails.route.map((step, index) => (
                <g key={index}>
                  {/* Draw line between stations */}
                  {index < journeyDetails.route.length - 1 && (
                    <line
                      x1="10"
                      y1={(index + 1) * 120 + 60} // Adjusted y1 to align with the circle's center
                      x2="10" // Keep x2 the same as x1 to create a vertical line
                      y2={(index + 2) * 120 + 60} // Adjusted y2 to align with the next circle's center
                      stroke={getLineColor(step.lineName)}
                      strokeWidth="4"
                    />
                  )}

                  {/* Draw station circles */}
                  <circle cx="10" cy={(index + 1) * 120 + 60} r="6" fill={getLineColor(step.lineName)} />
                </g>
              ))}
              {/* Render station names below the lines and circles */}
              {journeyDetails.route.map((step, index) => (
                <g key={index}>
                  {/* Label stations with line name */}
                  <text x="30" y={(index + 1) * 120 + 65} fill="black">
                    {`${step.fromStation} (${lineIdToNameMap[step.lineName] || 'Unknown Line'})`}
                  </text>
                  <text x="30" y={(index + 1.5) * 120 + 65} fill="black">
                    {`${step.toStation} (${lineIdToNameMap[step.lineName] || 'Unknown Line'})`}
                  </text>

                  {/* Display line name */}
                  <text x="10" y={(index + 1) * 120 + 15} fill={getLineColor(step.lineName)} className="font-bold">
                    {lineIdToNameMap[step.lineName] || 'Unknown Line'}
                  </text>

                  {/* Draw line change indicator */}
                  {index < journeyDetails.route.length - 1 && step.lineName !== journeyDetails.route[index + 1].lineName && (
                    <circle
                      cx="10"
                      cy={(index + 2) * 120 + 60} // Adjusted y-coordinate to align with the next circle's center
                      r="8"
                      fill="transparent"
                      stroke="black"
                      strokeWidth="4"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
        )}
        
        {/* Display station changes here */}
        <div className="flex-1 md:ml-6 mt-4">
          <h2 className="text-xl font-bold mb-2 text-gray-600">Station Changes</h2>
          {journeyDetails.route.map((step, index) => (
            <div key={index} className="mb-2">
              <span>{step.fromStation}</span> <span className="text-gray-600">to</span> <span>{step.toStation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Display alternative journeys */}
      {!journeyDetails.directLine && journeyDetails.alternativeJourneys && journeyDetails.alternativeJourneys.length > 0 && (
        <div>
          {journeyDetails.alternativeJourneys.map((alternativeJourney, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold mt-6 mb-2 text-gray-600">Alternative Journey {index + 1}</h2>
              <p>Start Time: {alternativeJourney.startDateTime}</p>
              <p>Duration: {alternativeJourney.duration}min</p>
              {/* Update the Price calculation */}
              <p>Price: £{(alternativeJourney.fare?.totalCost / 100).toFixed(2)}</p>
              <h3 className="text-lg font-bold mt-4 mb-2 text-gray-600">Line Changes</h3>
              {alternativeJourney.route?.length > 1 &&
                alternativeJourney.route.slice(0, -1).map((step, idx) => (
                  <p key={idx}>{`Change at ${step.toStation} to Line: ${getLineName(alternativeJourney.route[idx + 1]?.lineName || 'Unknown Line')}`}</p>
                ))}
              {/* Add logging to examine the API response */}
              {console.log('Alternative Journey API Response:', alternativeJourney)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/*AlternativeJourney. It takes in journeyData as a prop. The component renders a set of information about an alternative journey, including the start time, duration, and price. It also renders a list of legs for the journey, with each leg being displayed based on its transportation mode.*/
// Extracted alternativeJourney component
function AlternativeJourney({ journeyData }) {
  const price = journeyData.fare && journeyData.fare.totalCost ? (journeyData.fare.totalCost / 100).toFixed(2) : 'N/A';
  

  return (
    <div>
      <h3 className="text-lg font-bold mt-4 mb-2 text-gray-600">Alternative Journey</h3>
      <p>Start Time: {journeyData.startDateTime}</p>
      <p>Duration: {journeyData.duration}min</p>
      <p>Price: £{price}</p>

      {journeyData.legs && journeyData.legs.length > 0 && (
        <>
          {journeyData.legs.map((leg, idx) => {
            if (leg.mode && leg.mode.id === 'tube') {
              return (
                <p key={idx}>{`Take ${leg.mode.name} to ${leg.arrivalPoint.commonName}`}</p>
              );
            } else if (leg.mode && leg.mode.id === 'bus') {
              return (
                <p key={idx}>{`Take ${leg.mode.name} ${leg.instruction.summary}`}</p>
              );
            } else if (leg.mode && leg.mode.id === 'walking') {
              return (
                <p key={idx}>{`Walk to ${leg.arrivalPoint.commonName}, ${leg.instruction.summary}`}</p>
              );
            } else if (leg.mode && leg.mode.id === 'national-rail') {
              return (
                <p key={idx}>{`Take ${leg.mode.name} to ${leg.arrivalPoint.commonName}`}</p>
              );
            }
            return null;
          })}
        </>
      )}
    </div>
  );
}

/*fetchTubeLines that fetches tube lines from an API and returns a map of lineId to lineName. It first makes a request to the API using the fetch function. If the response is not successful, it throws an error.The fetchTubeLines function is an asynchronous function that fetches the tube lines from the API and returns a map of lineId to lineName.*/
async function fetchTubeLines() {
  try {
    const apiUrl = 'https://api.tfl.gov.uk/Line/Mode/tube';
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch tube lines.');
    }
    const data = await response.json();
    if (data && data.length > 0) {
      const lineIdToNameMap = {};
      data.forEach((line) => {
        lineIdToNameMap[line.id] = line.name;
      });
      return lineIdToNameMap;
    
    } else {
      console.error('No tube lines found in API response.');
      return {};
    }
  } catch (error) {
    console.error('Error fetching tube lines:', error);
    return {};
  }
}

/*The JourneyPlanner component is the main component that integrates all the other components. It fetches the station names and tube lines on component mount using useEffect. The component also includes an event handler handlePlanJourney that fetches the journey details from the API based on the selected "From" and "To" stations.*/
function JourneyPlanner() {
  const [stationNames, setStationNames] = useState([]);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [journeyDetails, setJourneyDetails] = useState(null);
  const [isFetchingJourney, setIsFetchingJourney] = useState(false);
  const [error, setError] = useState('');

  const [lineIdToNameMap, setLineIdToNameMap] = useState({}); // Add this state variable

  useEffect(() => {
    // Fetch all tube stations' names
    const fetchStationNames = async () => {
      try {
        const apiUrl = 'https://api.tfl.gov.uk/StopPoint/Mode/tube';
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch station names.');
        }
        const data = await response.json();
        if (data && data.stopPoints && data.stopPoints.length > 0) {
          // Use a Set to store unique station names
          const uniqueStationNames = new Set(data.stopPoints.map((station) => station.commonName));
          // Convert the Set back to an array and set the stationNames state
          setStationNames(Array.from(uniqueStationNames));
        } else {
          console.error('No station names found in API response.');
          setStationNames([]);
        }
      } catch (error) {
        console.error('Error fetching station names:', error);
        setStationNames([]);
      }
    };

    fetchStationNames();

    /*fetches tube lines asynchronously and stores them in the state. It uses an async IIFE (Immediately Invoked Function Expression) to do so. The fetched tube lines are logged to the console and then set in the state using the setLineIdToNameMap function. If there is an error while fetching the tube lines, an empty object is set in the state.*/
    // Fetch tube lines and store them in state using async IIFE
    const fetchTubeLinesAndSetState = async () => {
      try {
        const lineIdToNameMap = await fetchTubeLines();
        console.log('lineIdToNameMap:', lineIdToNameMap); // Log the lineIdToNameMap
        setLineIdToNameMap(lineIdToNameMap);
      } catch (error) {
        console.error('Error fetching tube lines:', error);
        setLineIdToNameMap({});
      }
    };
    fetchTubeLinesAndSetState();
  }, []);

  /*handles the logic for planning a journey using an API. It takes the selected fromStation and toStation, fetches the journey details from the API, and processes the response to extract relevant information such as startDateTime, duration, price, arrivalTime, alternativeJourneys, route, platform, and directLine. It also handles error cases and sets the journey details in the state.*/
  const handlePlanJourney = async () => {
    if (!fromStation || !toStation) {
      alert('Please select both from and to stations.');
      return;
    }
  
    setIsFetchingJourney(true);
    setError(''); // Reset the error message before starting the journey plan.
  
    try {
      // Fetch journey details from the API
      const apiUrl = `https://api.tfl.gov.uk/journey/journeyresults/${fromStation}/to/${toStation}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch journey details.');
      }
      const journeyData = await response.json();
  
      console.log('Journey API Response:', journeyData); // Log the journeyData for inspection
  
      const legs = journeyData.journeys[0]?.legs;
      console.log('Legs:', legs); // Log the legs array for inspection
  
      // Call the function to fetch tube lines
      const lineIdToNameMap = await fetchTubeLines();
  
      // Process the API response and extract relevant details
      const journeyDetails = {
        fromStation,
        toStation,
        startDateTime: journeyData.journeys[0].startDateTime,
        duration: journeyData.journeys[0].duration,
        price: (journeyData.journeys[0].fare.totalCost / 100).toFixed(2),
        arrivalTime: journeyData.journeys[0].arrivalDateTime,
        alternativeJourneys: journeyData.journeys.slice(1), // Extract alternative journeys
        route: journeyData.journeys[0].legs.map((leg) => ({
          fromStation: leg.departurePoint.commonName,
          toStation: leg.arrivalPoint.commonName,
          lineName: leg.lineIdentifier ? lineIdToNameMap[leg.lineIdentifier] : 'Unknown Line',
        })),
        platform: 'Unknown', // Default platform to 'Unknown' in case it's not available
        directLine: journeyData.journeys[0].lineIdentifier || '', // Set directLine to lineIdentifier or empty string if not available
      };
  
      // Find the platform information from the legs array
      if (journeyData.journeys[0].legs && journeyData.journeys[0].legs.length > 0) {
        const legs = journeyData.journeys[0].legs;
        for (const leg of legs) {
          if (leg.departurePoint && leg.departurePoint.platform) {
            journeyDetails.platform = leg.departurePoint.platform;
            break; // Stop after finding the first platform information
          }
        }
      } else {
        journeyDetails.platform = 'Unknown'; // Set platform to 'Unknown' if there are no legs in the journey
      }
  
      // Replace lineId with lineName in the route using the lineIdToNameMap
      journeyDetails.route = journeyDetails.route.map((step) => ({
        ...step,
        lineName: lineIdToNameMap[step.lineName] || 'Unknown Line', // Use lineIdToNameMap to get the line name
      }));
  
      setJourneyDetails(journeyDetails);
    } catch (error) {
      console.error('Error fetching journey details:', error);
      setError('Failed to fetch journey details.');
    } finally {
      setIsFetchingJourney(false);
    }
  };

  // Add conditional rendering for platform and direct line
  const platformText = journeyDetails?.platform ? `Platform: ${journeyDetails.platform}` : 'Platform: Unknown';
  const directLineText = journeyDetails?.directLine ? `Direct Line: ${journeyDetails.directLine}` : 'No direct line available for this route.';

  console.log('Extracted journeyDetails:', journeyDetails); // Log the extracted journeyDetails for inspection

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-600 mt-10 text-center">Journey Planner</h1>

      {/* Use only one instance of the StationSearch component for both "From" and "To" stations */}
      <StationSearch label="From" stationNames={stationNames} value={fromStation} onChange={setFromStation} />
        
      <hr className="my-4" />

      <StationSearch label="To" stationNames={stationNames} value={toStation} onChange={setToStation} />

      <button
        className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ${
          isFetchingJourney ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handlePlanJourney}
        disabled={isFetchingJourney}
      >
        Plan Journey
      </button>
      

      {/* Display loading message or error */}
      {isFetchingJourney && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {/* Extracted JourneyDetails component */}
      {journeyDetails && journeyDetails.route && (
        <JourneyDetails journeyDetails={journeyDetails} lineIdToNameMap={lineIdToNameMap} /> // Pass lineIdToNameMap to JourneyDetails
      )}
    </div>
  );
}

export default JourneyPlanner;

/*Key Learnings*/

/*Importing React, useState, and useEffect: The code uses import statements to import React and two hooks, useState and useEffect, which are essential for building React components and handling component state and side effects.

State Management: The code uses the useState hook to manage the component state. The state variables include stationNames, fromStation, toStation, journeyDetails, isFetchingJourney, and error.

Function Components: The code consists of functional components, which are React components defined as JavaScript functions. These components receive props as input and return JSX elements to define the component's output.

Handling User Input: The StationSearch component handles user input for station search. It includes an input field and a select dropdown that allow users to select "From" and "To" stations.

Filtering Station Names: The StationSearch component filters station names based on user input in the search input field. It dynamically updates the list of filtered stations as the user types.

SVG Visualization: The JourneyDetails component renders a visual representation of the journey route using SVG elements. It draws lines between stations and displays station names and line changes.

API Data Fetching: The fetchTubeLines function fetches tube lines data from the TFL API using the fetch function and asynchronous JavaScript (async/await). It then processes the response and returns a map of lineId to lineName.

useEffect Hook: The useEffect hook is used in the JourneyPlanner component to fetch station names and tube lines data on component mount. It fetches the data only once when the component is mounted.

Handling Errors: The code includes error handling for failed API requests or data processing errors. It displays error messages when applicable.

Asynchronous Code: The code uses asynchronous JavaScript to handle asynchronous tasks such as data fetching from APIs. It utilizes async/await to make asynchronous code more readable and maintainable.

Conditional Rendering: The code uses conditional rendering to display loading messages, error messages, and different components based on certain conditions. For example, the JourneyDetails component is conditionally rendered only when there are valid journey details available.

Props and Component Composition: Components are composed together by passing props from parent components to child components. The JourneyPlanner component passes data and functions as props to the StationSearch and JourneyDetails components.

Extracted Components: The code demonstrates component extraction and reusability. The AlternativeJourney component is extracted to handle rendering information about alternative journeys. This promotes code organization and maintainability.*/
    





