import React, { useEffect, useState } from "react";
import "../../App.scss";
import { Card, Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Loader from "react-loader-spinner";

const Dividends = (props) => {
  const [dividendYieldsSeries, setDividendYieldsSeries] = useState([]);
  const [dividendRawSeries, setDividendRawSeries] = useState([]);
  const [view, setView] = useState("yield");
  const [dividendRange, setDividendRange] = useState(25);
  const [oneYearGrowth, setOneYearGrowth] = useState(0);
  const [threeYearGrowth, setThreeYearGrowth] = useState(0);
  const [theme, setTheme] = useState("");
  const [textColor, setTextColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    props.darkMode ? setTheme("#000000") : setTheme("#FFFFFF");
    props.darkMode ? setTextColor("#FFFFFF") : setTextColor("#000000");
  }, [props.darkMode]);

  useEffect(() => {
    const dividend_yields = fetch(
      `https://sigma7-analytics.azure-api.net/sigma7-analytics/div_yield?symbol=${props.activeTicker}`
    ).then((res) => res.json());

    const dividend_raw = fetch(
      `https://cloud.iexapis.com/stable/stock/${props.activeTicker}/dividends/5y?token=pk_6fdc6387a2ae4f8e9783b029fc2a3774`
    ).then((res) => res.json());

    Promise.resolve(dividend_raw).then((dividend_raw) => {
      let dividendData = dividend_raw.reverse().map((el) => {
        return {
          x: el.recordDate,
          y: el.amount.toFixed(2),
          color: "#007bff",
        };
      });
      setDividendRawSeries(dividendData);
      setIsLoading(false);
    });

    Promise.resolve(dividend_yields).then((dividend_yields) => {
      let yields = dividend_yields.chart.yield;

      let dividendData = Object.keys(yields).map((el, i) => {
        return {
          x: el,
          y: yields[el].toFixed(2),
          color: "#007bff",
        };
      });
      setOneYearGrowth(dividend_yields["1yr_growth"]);
      setThreeYearGrowth(dividend_yields["3yr_growth"]);

      setDividendYieldsSeries(dividendData);
      setIsLoading(false);
    });
  }, [dividendRange, props.activeTicker]);

  const handleClick = (e) => {
    setDividendRange(e.target.value);
  };

  useEffect(() => {
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("dividend-yield-div", am4charts.XYChart);

    // Add data
    chart.data = dividendYieldsSeries;
    console.log(dividendYieldsSeries);

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.labels.template.fill = textColor;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = textColor;

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "y";
    series.dataFields.dateX = "x";
    series.strokeWidth = 2;
    series.propertyFields.stroke = "color";
    series.propertyFields.fill = "color";
    series.minBulletDistance = 10;
    series.tooltipText = "{valueY}%";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;
  }, [isLoading, dividendYieldsSeries, view, textColor]);

  useEffect(() => {
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("dividend-raw-div", am4charts.XYChart);

    // Add data
    chart.data = dividendRawSeries;

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.labels.template.fill = textColor;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = textColor;

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "y";
    series.dataFields.dateX = "x";
    series.strokeWidth = 2;
    series.propertyFields.stroke = "color";
    series.propertyFields.fill = "color";
    series.minBulletDistance = 10;
    series.tooltipText = "${valueY}/share";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;
  }, [isLoading, dividendRawSeries, view, textColor]);

  let yieldHeader = (
    <div>
      Dividend Yield
      <button
        className="btn btn-primary change-view-button"
        onClick={() => setView("raw")}
      >
        Change View
      </button>
    </div>
  );

  let rawHeader = (
    <div>
      Dividend Per Share
      <button
        className="btn btn-primary change-view-button"
        onClick={() => setView("yield")}
      >
        Change View
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <Card
        title={props.title}
        extra={props.extra}
        style={{
          height: "100%",
          overflow: "auto",
        }}
      >
        <hr className="card-hr" />

        <Loader
          className="fullyCentered"
          type="Puff"
          color="#007bff"
          height={100}
          width={100}
        />
      </Card>
    );
  } else {
    if (view == "yield") {
      return (
        <Card
          title={yieldHeader}
          extra={props.extra}
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <hr className="card-hr" />
          <div>
            <div style={{ height: 424 }} id="dividend-yield-div" />

            <p className="dividends-growth-1y center">
              1yr Growth:{" "}
              <span className="blue">{oneYearGrowth.toFixed(2)}%</span>
            </p>
            <p className="dividends-growth-3y center">
              3yr Growth:{" "}
              <span className="blue">{threeYearGrowth.toFixed(2)}%</span>
            </p>
            {/* <div className="row">
              <div className="col-sm-12">
                <Dropdown overlay={menu}>
                  <btn className="ant-dropdown-link">
                    Range <DownOutlined />
                  </btn>
                </Dropdown>
              </div>
            </div> */}
          </div>
        </Card>
      );
    } else {
      if (view == "raw") {
        return (
          <Card
            title={rawHeader}
            extra={props.extra}
            style={{
              height: "100%",
              overflow: "auto",
            }}
          >
            <hr className="card-hr" />
            <div >
              <div style={{ height: 424 }} id="dividend-raw-div" />

              <p className="dividends-growth-1y center">
                1yr Growth:{" "}
                <span className="blue">{oneYearGrowth.toFixed(2)}%</span>
              </p>
              <p className="dividends-growth-3y center">
                3yr Growth:{" "}
                <span className="blue">{threeYearGrowth.toFixed(2)}%</span>
              </p>
              {/* <div className="row">
                <div className="col-sm-12">
                  <Dropdown overlay={menu}>
                    <btn className="ant-dropdown-link">
                      Range <DownOutlined />
                    </btn>
                  </Dropdown>
                </div>
              </div> */}
            </div>
          </Card>
        );
      }
    }
  }
};

export default Dividends;
