import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

// OPTIONS FOR LINE GRAPH
const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const casesTypeColor = {
  cases: {
    backgroundColor: "rgba(204, 16, 52, 0.5)",
    borderColor: "#CC1034",
  },
  recovered: {
    borderColor: "#7DD71D",
    backgroundColor: "rgba(125,215,29,0.5)",
  },

  deaths: {
    borderColor: "#444444",
    backgroundColor: "#7f7d7c",
  },
};

function LineGraph({ casesType, ...props }) {
  const [data, setData] = useState({});

  let days = 200;
  const url = `https://disease.sh/v3/covid-19/historical/all?lastdays=${days}`;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    //CALCULATE NEW CASES EACH DAY
    for (let date in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };
  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                fill: true,
                backgroundColor: `${casesTypeColor[casesType].backgroundColor}`,
                borderColor: `${casesTypeColor[casesType].borderColor}`,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
