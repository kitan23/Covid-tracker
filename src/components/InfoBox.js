//CREATE 3 SMALL INFO BOXES INDICATING DEATH, CASES, RECOVERED
import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import numeral from "numeral";
import "../styles/InfoBox.css";

function InfoBox({ title, cases, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${props.active && "infoBox--selected"} ${
        props.isRed && "infoBox--red"
      } ${props.isGrey && "infoBox--grey"}`}
    >
      <CardContent>
        {/* TITLE */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        {/* NUMBER OF NEW CASES */}
        <h2
          className={`infoBox__cases ${
            props.isGreen && "infoBox__cases--green"
          } ${props.isGrey && "infoBox__cases--grey"} 
          `}
        >
          {cases}
        </h2>
        {/* TOTAL */}
        <Typography className="infoBox__total" color="textSecondary">
          <strong>{numeral(total).format("0,0")}</strong> Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
