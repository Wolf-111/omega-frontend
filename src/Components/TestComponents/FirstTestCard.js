import React from "react";
import "../../App.scss";
import { Card } from "antd";

const FirstTestCard = (props) => {
  return (
    <Card title={props.title}>
      <hr className="card-hr" />

      <h1>{props.name}</h1>
    </Card>
  );
};

export default FirstTestCard;
