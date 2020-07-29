import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";
import './App.css';
import InfoBox from './InfoBox';

function App(){
  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState("worldwide");
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({ lat: 34.80746, lng: -40.4796}); //Center of Map
  const [mapZoom,setMapZoom] = useState(3); 
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");
  // State --> How to write a variable in React

  //This use effect will Fetch Data For initial Look --> Worldwide Content
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    //We use async --> Send the request : Wait for Data to Load before carrying on the Process : Stored in our Variable for Manupulation
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData(); //Calling the Function
  },[]);

  //This Function is to show the new Selected Value from the Dropdown
  const onCountryChange = async(event) =>{
    const countryCode = event.target.value;
    setCountry(countryCode);
    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    const url = 
      countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
      // When we Change the country from the Dropdown we store all the data regarding that country in countryInfo
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long])
      setMapZoom(4);
    });
  
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          {/* Material UI : FormControl, Select, MenuItem */}
          <FormControl className="app__dropdown"> {/* component__element  --> BEM Convention*/}
            <Select variant = "outlined" value = {country} onChange={onCountryChange}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Loop through all the Countries for DropDown */}
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        {/* InfoBoxes */}
        <div className="app__stats">
          {/* Current Code works just for Selected values and we need to initialize values for Worldwide */}
              <InfoBox
                isRed
                active = {casesType === "cases"} 
                onClick = {(e) => setCasesType("cases")}
                title = "Coronavirus Cases" 
                cases = {prettyPrintStat(countryInfo.todayCases)} 
                total = {prettyPrintStat(countryInfo.cases)} 
                />
              <InfoBox
                active = {casesType === "recovered"} 
                onClick = {(e) => setCasesType("recovered")}
                title = "Recovered Cases" 
                cases = {prettyPrintStat(countryInfo.todayRecovered)} 
                total = {prettyPrintStat(countryInfo.recovered)} 
                />
              <InfoBox
                isRed 
                active = {casesType === "deaths"}
                onClick = {(e) => setCasesType("deaths")}
                title = "Death" 
                cases = {prettyPrintStat(countryInfo.todayDeaths)} 
                total = {prettyPrintStat(countryInfo.deaths)} 
                />
        </div>
        {/* Maps */}
        <Map
          casesType = {casesType} 
          countries = {mapCountries}
          center = {mapCenter}
          zoom = {mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries = {tableData}/>
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType = {casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

// https://disease.sh/v3/covid-19/countries --> API Call
// Useeffect --> Runs a piece of code based on a given condition

// const [countries,setCountries] = useState(["USA","US","INDIA"]);
{/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Option 1</MenuItem>
            <MenuItem value="worldwide">Option 2</MenuItem>
            <MenuItem value="worldwide">Option 3</MenuItem> */}

// useEffect(() => {
//   // The Code in this block runs once when the component is loaded and when countries variables value changes
//   // If the Array was empty then this block loads only once  --> When the component is loaded
// }, [countries]);

// 

// {/* HEADER */}
// {/* TITLE + DROPDOWN */}
// {/* INFOBOX */}
// {/* INFOBOX */}
// {/* INFOBOX */}
// {/* TABLES */}
// {/* GRAPHS */}
// {/* MAPS */}