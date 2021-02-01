import React, { useState, useEffect } from "react";
import "./App.scss";
import EquityDashboard from "./Components/EquityDashboard/EquityDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/src/collapse.js";
import "antd/dist/antd.css";
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Index,
} from "react-router-dom";
import Portfolio from "./Components/Portfolio/Portfolio";

function App() {
  const [activeTicker, setActiveTicker] = useState("AAPL");
  const [priceRange, setPriceRange] = useState("1y");
  const [dividendRange, setDividendRange] = useState(25);
  const [earningsPeriod, setEarningsPeriod] = useState("Q");
  const [frame, setFrame] = useState("daily");
  const apiBaseUrl = "https://api-omega.azurewebsites.net/api";
  const apiCode = "pcRfOm56RQRqa9ixWAyq9qWtlofFpzIZZbVAcNxGwJBEMaA4z1Q5Qw";

  // The 7 values in the state array are the id's of the cards that render on the dashboard by default.
  // These are the initial "selected" cards that render by default
  const [selectedCardsIndex, setSelectedCardsIndex] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
  ]);

  useEffect(() => {
    selectedCardsIndex.sort(function (a, b) {
      return a - b;
    });
  }, [selectedCardsIndex]);

  // These are every single available card throughout the platform, each identified by an id
  // which helps with identifying which cards are rendered on the dashboard and which ones aren't
  const [availableCards, setAvailableCards] = useState([
    {
      id: 0,
      name: "TickerHeader",
      title: "Ticker Header",
      description: "",
      sector: "",
      country: "",
      phone: "",
    },
    {
      id: 1,
      name: "Earnings",
      title: "Earnings",
      actual: { name: "Actual", eps: [] },
      consensus: { name: "Consensus", eps: [] },
      earningsPeriod: earningsPeriod,
      setEarningsPeriod: setEarningsPeriod,
      dates: [],
      x: 0,
      y: 0,
      w: 6,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 2,
      name: "AnalystRecommendations",
      title: "Analyst Recommendations",
      data: [],
      x: 12,
      y: 0,
      w: 6,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 3,
      name: "Dividends",
      title: "Dividends",
      data: [],
      dividendRange: dividendRange,
      setDividendRange: setDividendRange,
      dataLabel: "Dividend/Share",
      x: 0,
      y: 0,
      w: 4,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 4,
      name: "Price",
      title: "Price",
      data: [],
      priceRange: priceRange,
      setPriceRange: setPriceRange,
      frame: frame,
      setFrame: setFrame,
      date: "",
      tickCount: 10,
      dataLabel: "Price",
      x: 4,
      y: 0,
      w: 4,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 5,
      name: "PriceTarget",
      title: "Price Target",
      data: [[], {}],
      tickCount: 4,
      dataLabel: "Price",
      x: 12,
      y: 0,
      w: 4,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 6,
      name: "RiskAnalysis",
      title: "Performance (Risk Adjusted)",
      data: [1.08],
      dataLabel: "Risk",
      x: 0,
      y: 0,
      w: 6,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 7,
      name: "PriceCalendar",
      title: "Price Calendar",
      data: [],
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 8,
      name: "Buybacks",
      title: "Buybacks",
      data: [
        { name: "2014", data: 20 },
        { name: "2015", data: 25 },
        { name: "2016", data: 37 },
        { name: "2017", data: 43 },
        { name: "2018", data: 43.5 },
        { name: "2019", data: 56 },
        { name: "2020", data: 60.5 },
      ],
      x: 0,
      y: 0,
      w: 6,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 9,
      name: "News",
      title: "News",
      data: [],
      x: 0,
      y: 0,
      w: 12,
      h: 0.25,
      minW: 3,
      maxH: 0.25,
      isResizable: false,
    },

    {
      id: 10,
      name: "PriceHistogram",
      title: "Price Histogram",
      data: [],
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 11,
      name: "Economics",
      title: "Economics",
      data: [
        { name: "2014", data: 2.45 },
        { name: "2015", data: 2.88 },
        { name: "2016", data: 1.57 },
        { name: "2017", data: 2.22 },
        { name: "2018", data: 3.18 },
        { name: "2019", data: 2.33 },
        { name: "2020", data: -5.9 },
      ],
      dataLabel: "GDP",
      x: 12,
      y: 0,
      w: 6,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 12,
      name: "OverallReturns",
      title: "Overall Returns",
      data: [],
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      minW: 3,
      maxH: 1,
    },

    {
      id: 13,
      name: "AverageReturns",
      title: "Average Returns",
      data: [],
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      minW: 3,
      maxH: 1,
    },
  ]);

  /*
  This will eventually control the colors of the datapoints on the Earnings card
  let consensus_data = availableCards[1].data[0].data;
  let actual_data = availableCards[1].data[1].data;

  let consensus_arr = [];
  consensus_data.map((el) => {
    consensus_arr.push(el[1]);
    return consensus_arr;
  });

  let actual_arr = [];
  actual_data.map((el) => {
    actual_arr.push({
      value: el[1],
      color: "green",
    });
    return actual_arr;
  });

  actual_arr.map((el, count) => {
    if (el.value < consensus_arr[count]) {
      el.color = "red";
    }
    return actual_arr;
  });

  console.log(actual_arr);
*/

  // The reason why many different endpoints have their own useEffect hooks is because we want to get
  // new data from each individual endpoint based on whether or not specific state values have changed. For instance if
  // priceRange or frame changes, we ONLY want to upate the prices endpoint, and every single one. Same idea applies with
  // the dividend endpoint and the dividendRange state value.
  useEffect(() => {
    const prices = fetch(
      `${apiBaseUrl}/prices?code=${apiCode}==&symbol=${activeTicker}&range=${priceRange}&frame=${frame}`
    ).then((res) => res.json());

    Promise.resolve(prices).then((price) => {
      // Function syntax of setState to use the previous value from the state, as recommended by React
      setAvailableCards((prevCards) => {
        // For each cards, return a new modified version of that card
        return prevCards.map((card) => {
          if (card.name == "Price") {
            let date = Object.keys(price).map(function (key, i) {
              return {
                label: key,
                x: i,
              };
            });

            return {
              ...card,
              data: Object.keys(price).map(function (key, i) {
                return {
                  x: i,
                  open: price[key].adj_open,
                  high: price[key].adj_high,
                  low: price[key].adj_low,
                  close: price[key].adj_close,
                  volume: price[key].volume,
                };
              }),
              priceRange: priceRange,
              setPriceRange: setPriceRange,
              frame: frame,
              setFrame: setFrame,
              date: date,
            };
          }
          if (card.name == "PriceHistogram") {
            return {
              ...card,
              data: Object.keys(price).map(function (key) {
                return {
                  x: key,
                  y: [
                    price[key].adj_open,
                    price[key].adj_high,
                    price[key].adj_low,
                    price[key].adj_close,
                  ],
                  change: price[key].change,
                };
              }),
              priceRange: priceRange,
              setPriceRange: setPriceRange,
              frame: frame,
              setFrame: setFrame,
            };
          }
          if (card.name == "OverallReturns") {
            return {
              ...card,
              data: Object.keys(price).map(function (key) {
                return {
                  x: key,
                  change: price[key].change,
                };
              }),
              priceRange: priceRange,
              setPriceRange: setPriceRange,
              frame: frame,
              setFrame: setFrame,
            };
          }
          return card;
        });
      });
    });
  }, [priceRange, frame, activeTicker]);

  useEffect(() => {
    const dividends = fetch(
      `${apiBaseUrl}/dividends?code=${apiCode}==&symbol=${activeTicker}&lastN=${dividendRange}`
    ).then((res) => res.json());

    Promise.resolve(dividends).then((dividends) => {
      // Function syntax of setState to use the previous value from the state, as recommended by React
      setAvailableCards((prevCards) => {
        // For each cards, return a new modified version of that card
        return prevCards.map((card) => {
          if (card.name == "Dividends") {
            return {
              ...card,
              data: Object.keys(dividends.amount)
                .reverse()
                .map(function (key) {
                  return {
                    label: key,
                    value: dividends.amount[key].toFixed(2),
                  };
                }),
              dividendRange: dividendRange,
              setDividendRange: setDividendRange,
            };
          }
          return card;
        });
      });
    });
  }, [dividendRange, activeTicker]);

  useEffect(() => {
    const earnings = fetch(
      `${apiBaseUrl}/earnings?code=${apiCode}==&symbol=${activeTicker}&lastN=4&period=${earningsPeriod}`
    ).then((res) => res.json());

    // const earnings = fetch(
    //   `https://sandbox.iexapis.com/stable/stock/${activeTicker}/earnings/4?period=${earningsPeriod}&token=Tpk_f087e31de6d8452abceb72a5ce7a77fd`
    // ).then((res) => res.json());

    Promise.resolve(earnings).then((earnings) => {
      // Function syntax of setState to use the previous value from the state, as recommended by React
      setAvailableCards((prevCards) => {
        // For each cards, return a new modified version of that card
        return prevCards.map((card) => {
          if (card.name == "Earnings") {
            let dates = Object.keys(earnings.fiscal_period)
              .sort()
              .map(function (key, i) {
                return earnings.fiscal_period[key];
              });

            let consensusMap = Object.keys(earnings.consensus_eps)
              .sort()
              .map(function (key, i) {
                return {
                  x: dates[i],
                  y: earnings.consensus_eps[key].toFixed(2),
                };
              });

            let actualMap = Object.keys(earnings.real_eps)
              .sort()
              .map(function (key, i) {
                return {
                  x: dates[i],
                  y: earnings.real_eps[key].toFixed(2),
                };
              });

            return {
              ...card,
              actual: {
                name: "Actual",
                eps: actualMap,
              },

              consensus: {
                name: "Consensus",
                eps: consensusMap,
              },

              earningsPeriod: earningsPeriod,
              setEarningsPeriod: setEarningsPeriod,
              dates,
            };
          }
          return card;
        });
      });
    });
  }, [earningsPeriod, activeTicker]);

  useEffect(() => {
    const company = fetch(
      `https://cloud.iexapis.com/stable/stock/${activeTicker}/company?token=pk_41174bf196e6408bb544b6d89806902a`
    ).then((res) => res.json());

    const prices = fetch(
      `${apiBaseUrl}/prices?code=${apiCode}==&symbol=${activeTicker}&range=1y`
    ).then((res) => res.json());

    const price_calendar = fetch(
      `${apiBaseUrl}/avg_return?code=${apiCode}==&symbol=${activeTicker}&range=max`
    ).then((res) => res.json());

    const price_target = fetch(
      `${apiBaseUrl}/price_targets?code=${apiCode}==&symbol=${activeTicker}`
    ).then((res) => res.json());

    const analyst_recs = fetch(
      `${apiBaseUrl}/analyst_recs?code=${apiCode}==&symbol=${activeTicker}`
    ).then((res) => res.json());

    const news = fetch(
      `https://cloud.iexapis.com/stable/stock/${activeTicker}/news/last/50?token=pk_756d2eedb1d64c5192084581943ee4b9`
    ).then((res) => res.json());

    const allReqs = [
      company,
      price_target,
      prices,
      analyst_recs,
      news,
      price_calendar,
    ];

    Promise.all(allReqs).then((allResp, price) => {
      const [
        company,
        price_target,
        prices,
        analyst_recs,
        news,
        price_calendar,
      ] = allResp;

      // Function syntax of setState to use the previous value from the state, as recommended by React
      setAvailableCards((prevCards) => {
        // For each cards, return a new modified version of that card
        return prevCards.map((card) => {
          switch (card.name) {
            case "TickerHeader":
              return {
                ...card,
                company_name: company.company_name,
                ticker: activeTicker,
                description: company.description,
                sector: company.sector,
                country: company.country,
                phone: company.phone,
                // forward_pe_ratio: adv_stats.forward_pe_ratio.toFixed(2),
                // price_to_book: adv_stats.price_to_book.toFixed(2),
                // price_to_sales: adv_stats.price_to_sales.toFixed(2),
              };

            case "PriceTarget":
              return {
                ...card,
                data: [
                  Object.keys(prices).map(function (key) {
                    return {
                      label: key,
                      value: prices[key].adj_close,
                    };
                  }),
                  {
                    last_updated: price_target.update_date,
                    average: price_target.price_target_avg,
                    high: price_target.price_target_high,
                    low: price_target.price_target_low,
                    numOfAnalysts: price_target.num_of_analysts,
                  },
                ],
              };

            case "PriceCalendar":
              return {
                ...card,
                data: Object.keys(price_calendar).map(function (key) {
                  return {
                    value: (price_calendar[key].avg_return) * 100,
                  };
                }),
                priceRange: priceRange,
                setPriceRange: setPriceRange,
                frame: frame,
                setFrame: setFrame,
              };

            case "AnalystRecommendations":
              return {
                ...card,
                data: [
                  { name: "Strong Buy", value: analyst_recs.rating_overweight },
                  { name: "Buy", value: analyst_recs.rating_buy },
                  { name: "Hold", value: analyst_recs.rating_hold },
                  { name: "Sell", value: analyst_recs.rating_sell },
                  {
                    name: "Strong Sell",
                    value: analyst_recs.rating_underweight,
                  },
                ],
              };

            case "News":
              return {
                ...card,
                data: Object.keys(news).map(function (key) {
                  return {
                    title: news[key].headline,
                    source: news[key].source,
                  };
                }),
              };
          }

          // Otherwise return the original card
          return card;
        });
      });
    });
  }, [activeTicker]);

  return (
    <div className="app">
      <div className="side-margin">
        <Router>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/dashboard">
              <EquityDashboard
                availableCards={availableCards}
                selectedCardsIndex={selectedCardsIndex}
                setSelectedCardsIndex={setSelectedCardsIndex}
                setActiveTicker={setActiveTicker}
              />
            </Route>
            <Route path="/portfolio">
              <Portfolio />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
