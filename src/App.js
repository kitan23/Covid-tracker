import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import uuid from "react-uuid";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import { sortData, prettyPrintStat } from "./utils/utils";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  //TYPES TO SHOW ON MAP: CONFIRMED, DEATHS, RECOVERED
  const [casesType, setCasesType] = useState("cases");

  //SET UP THE CENTER COORDINATES OF THE MAP
  const defaultCoordinates = [42.5, 1.6];
  const [mapCenter, setMapCenter] = useState(defaultCoordinates);
  //SET UP ZOOM SCALE FOR THE MAP
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  //SET THE 3 INFO BOXES FOR WORLDWIDE CASES
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);

  //SET THE TABLE DATA, DROPDOWN OPTIONS
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
            id: country.countryInfo._id,
          }));
          // SET COUNTRIES FOR THE DROPDOWN
          setCountries(countries);

          //SET COUNTRIES FOR ALL INFORMATION FOR RED CIRCLES ON THE MAP
          setMapCountries(data);

          // SORT DATA BY NUMBER OF COVID CASES
          const sortedData = sortData(data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // SET THE SELECTED COUNTRY FOR INFO
        setCountry(countryCode);
        // ALL THE DATA FOR THE COUNTRY
        setCountryInfo(data);
        //SET THE MAP COORDINATE FOR THE COUNTRY
        countryCode === "worldwide"
          ? setMapCenter(defaultCoordinates)
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  // CHECK THE COUNTRY INFO IN THE CONSOLE LOG
  // console.log(country);
  // console.log(mapCenter);
  return (
    <div className="app">
      <div className="app__left">
        {/* HEADER */}
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          {/* TITLE + COUNTRIES DROPDOWN MENU */}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries &&
                countries.map((country) => (
                  <MenuItem key={uuid()} value={country.value}>
                    {country.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        {/* 3 INFO BOXES  */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            isGreen
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            isGrey
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Death"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>
        {/* MAP */}
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          {/* TABLE  */}
          <h3>Live Cases by Country </h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
        {/* GRAPH  */}
      </Card>
    </div>
  );
}

export default App;
