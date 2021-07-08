import React, { useEffect, useState } from "react";
import "../../App.scss";
import { useHistory } from "react-router";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import DarkModeToggle from "../DarkModeToggle";
import AddCardModal from "../AddCardModal/AddCardModal";
import SaveLayoutButton from "../EquityDashboard/SaveLayoutButton";
import ShareLayoutModal from "../ShareLayoutModal/ShareLayoutModal";
import logo from "./logo.png";
import TextField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';


import { useAuth0 } from "@auth0/auth0-react";
import Feedback from "../Feedback/Feedback";

const DashboardNavbar = (props) => {
  const { isAuthenticated, user } = useAuth0();
  const [allowedStocks, setAllowedStocks] = useState([]);
  const [ticker, setTicker] = useState("");
  const [invalidTicker, setInvalidTicker] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [theme, setTheme] = useState("");
  const [highlightColor, setHighlightColor] = useState("");
  const [scrollbarColor, setScrollbarColor] = useState("");

  const routerHistory = useHistory();

  useEffect(() => {
    props.darkMode ? setTheme("#000000") : setTheme("#FFFFFF");
    props.darkMode
      ? setScrollbarColor("#152233 #131722")
      : setScrollbarColor("");

    props.darkMode
      ? setHighlightColor("#292929")
      : setHighlightColor("lightgrey");
  }, [props.darkMode]);

  useEffect(() => {
    const allowed_stocks = fetch(
      `https://cloud.iexapis.com/stable/ref-data/symbols?token=pk_6fdc6387a2ae4f8e9783b029fc2a3774`
    ).then((res) => res.json());

    Promise.resolve(allowed_stocks).then((allowed_stocks) => {
      let mapped = allowed_stocks.map((el, i) => {
        return {
          symbol: el.symbol,
          name: el.name
        }
      })
      setAllowedStocks(mapped);
    });
  }, [props.activeTicker]);

  useEffect(() => {
    let mapped = allowedStocks.map((stock) => {
      return {
        name: stock.name,
        value: stock.name + ' - ' + stock.symbol,
        symbol: stock.symbol
      };
    });
    setSuggestions(mapped);
  }, [allowedStocks]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let allowed_stocks = allowedStocks.map((el, i) => {
      return el.symbol
    })

    if (allowed_stocks.includes(ticker)) {
      setInvalidTicker(false);
      props.setActiveTicker(ticker);
      routerHistory.push(
        `/dashboard/${props.userID}/${props.selectedLayoutName}/${ticker}`
      );
    } else {
      setInvalidTicker(true);
    }
    setTicker("");
  };

  const OPTIONS_LIMIT = 30;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
      <a className="navbar-brand" href="/">
        <img
          src={logo}
          width="45"
          className="d-inline-block align-top"
          alt="sigma7"
        />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            {isAuthenticated ? (
              <a className="nav-link" href={`dashboard/${user.sub}`}>
                Dashboard
              </a>
            ) : (
              <h1>loading</h1>
            )}
          </li>
        </ul>

        <form onSubmit={handleSubmit}>
          <Autocomplete
            id="clear-on-blur"
            clearOnBlur
            style={{ backgroundColor: "white", width: 200, height: 35 }}
            filterOptions={filterOptions}
            options={suggestions}
            getOptionLabel={(option) => option.name + " - " + option.symbol}

            renderInput={(params) => <TextField placeholder="Stock Symbol" {...params} style={{ height: 35 }} variant="outlined" />}
            renderOption={(option) => (
              <div onClick={(e) => {
                setTicker(e.target.innerText)
              }}>
                {option.name} - <span className="blue">{option.symbol}</span>
              </div>
            )}
            onSelect={(val) => {
              let parts = val.target.value.split('- ');
              let answer = parts[parts.length - 1];
              console.log(answer)
              setTicker(answer.toUpperCase());
            }}
          />
        </form>

        {invalidTicker && (
          <p style={{ color: "red" }}>
            Please use a valid stock symbol
          </p>
        )}

        <div className="ml-auto row">
          <div className="dashboard-nav-button">
            <DarkModeToggle setDarkMode={props.setDarkMode} />
          </div>
          <div className="dashboard-nav-button">
            <AddCardModal
              availableCards={props.availableCards}
              setAvailableCards={props.setAvailableCards}
              selectedCardsIndex={props.selectedCardsIndex}
              setSelectedCardsIndex={props.setSelectedCardsIndex}
              darkMode={props.darkMode}
              activeTicker={props.activeTicker}
            />{" "}
          </div>
          <div className="dashboard-nav-button">
            {/* Button that allows user to save layout goes here */}
            <SaveLayoutButton
              wasTaken={props.wasTaken}
              setNewLayoutName={props.setNewLayoutName}
              userID={props.userID}
              dashboardNames={props.dashboardNames}
              setDashboardNames={props.setDashboardNames}
              setSelectedLayoutIndex={props.setSelectedLayoutIndex}
              setWasYourDashboardSelected={props.setWasYourDashboardSelected}
            />{" "}
          </div>
          <div className="dashboard-nav-button">
            <ShareLayoutModal
              userID={props.userID}
              mainLayout={props.mainLayout}
              selectedDashboardName={props.selectedDashboardName}
            />{" "}
          </div>
          {/* <div className="dashboard-nav-button">
            <a href={`/explore/${props.userID}`}>
              <button className="btn btn-primary">Explore</button>
            </a>
          </div> */}
          <div className="dashboard-nav-button">
            {props.isAuthenticated ? (
              <a href="/profile">
                <button className="btn btn-info">Profile</button>
              </a>
            ) : null}
          </div>
          {/* <div className="dashboard-nav-button">
            <button
              onClick={() => props.setIsTourOpen(true)}
              className="btn btn-info"
            >
              Tour
            </button>
          </div> */}
          <div className="dashboard-nav-button">
            <a href={`/feedback/${props.userID}`}>
              <button className="btn btn-info">Feedback</button>
            </a>
          </div>{" "}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
