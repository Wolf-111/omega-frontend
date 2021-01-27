import React, { useEffect, useState } from "react";
import "../../App.scss";
import { Card, Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";

// Resolves charts dependancy
charts(FusionCharts);

const Dividends = (props) => {
  const [series, setSeries] = useState();

  useEffect(() => {
    setSeries(props.data);
  }, [props.data]);

  const handleClick = (e) => {
    props.setDividendRange(e.target.value);
  };

  const dataSource = {
    chart: {
      numberPrefix: "$",
      rotateLabels: 0,
      canvasbgColor: "#000000",
      canvasbgAlpha: "100",
      canvasBorderThickness: "0",
      showAlternateHGridColor: "0",
      bgColor: "#000000",
      bgAlpha: "#000000",
      showBorder: "0",
      palettecolors: "#007bff",
      anchorBgColor: "#007bff",
    },
    data: series,
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <button
          className="btn btn-sm shadow-none dropdown-btn"
          onClick={handleClick}
          value="5"
        >
          5
        </button>
      </Menu.Item>
      <Menu.Item>
        <button
          className="btn btn-sm shadow-none dropdown-btn"
          onClick={handleClick}
          value="10"
        >
          10
        </button>
      </Menu.Item>
      <Menu.Item>
        <button
          className="btn btn-sm shadow-none dropdown-btn"
          onClick={handleClick}
          value="15"
        >
          15
        </button>
      </Menu.Item>
      <Menu.Item>
        <button
          className="btn btn-sm shadow-none dropdown-btn"
          onClick={handleClick}
          value="20"
        >
          20
        </button>
      </Menu.Item>
      <Menu.Item>
        <button
          className="btn btn-sm shadow-none dropdown-btn"
          onClick={handleClick}
          value="25"
        >
          25
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Card
      title={props.title}
      extra={props.button}
      style={{
        height: "100%",
        overflow: "auto",
        scrollbarColor: "#152233 #131722",
      }}
    >
      <hr className="card-hr" />

      <div style={{ height: 456 }}>
        <ReactFusioncharts
          type="line"
          width="100%"
          height="80%"
          dataFormat="JSON"
          dataSource={dataSource}
        />
        <div className="row">
          <div className="col-sm-12">
            <Dropdown overlay={menu}>
              <btn className="ant-dropdown-link">
                Range <DownOutlined />
              </btn>
            </Dropdown>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Dividends;
