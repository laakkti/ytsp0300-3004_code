/**
 * DataChart renders a Plotly.js chart based on the provided data and configuration.
 *
 * @param {Object} data - The data to be plotted, including x_labels and data for each year.
 * @param {string} selectedYear - The year selected by the user to filter the data.
 * @param {string} selectedDate - The date selected by the user to highlight on the chart.
 * @param {string} [fill=''] - The fill option for the plot, defaults to an empty string if undefined.
 * @param {number} height - The height of the chart.
 * @returns {React.ReactElement|null} - The Plotly.js chart component or null if data is empty or selectedDate is undefined.
 */

import React from "react";
import Plot from "react-plotly.js";

const DataChart = ({ data, selectedYear, selectedDate, fill, height }) => {
  if (fill === undefined) {
    fill = "";
  }

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  if (data.length === 0 || selectedDate === undefined) {
    return null;
  }

  selectedDate = selectedDate.split(" ")[0];
  const dotIndex = selectedDate.lastIndexOf(".");
  const year = selectedDate.substring(dotIndex + 1); // "2023"
  const date = selectedDate.substring(0, dotIndex); // "24.04"

  let plotData = [];

  for (let i = 0; i < data.data.length; i++) {
    const selectedIndex = data.x_labels.findIndex(function (item) {
      return item === date;
    });

    let arr = [];

    if (selectedYear === data.data[i].year) {
      arr = Array(data.data[i].data.length)
        .fill(0)
        .map((item, i) => (i === selectedIndex ? 1 : 0));
    } else {
      arr = Array(data.data[i].data.length)
        .fill(0)
        .map((item, i) => 0);
    }

    let tmp = {
      x: data.x_labels,
      y: data.data[i].data,
      name: data.data[i].year,
      type: "scatter",
      mode: "lines+markers",
      marker: {
        opacity: arr,
        color: "#000000",
        size: 20,
      },
      line: {
        color: getRandomColor(),
        shape: "spline",
        width: fill === "tozeroy" ? 2 : 6,
      },
      connectgaps: true,
      fill: fill,
    };

    plotData = [...plotData, tmp];
  }

  const config = {
    staticPlot: true,
    responsive: true,
    displayModeBar: false,
    scrollZoom: false,
  };

  const layout = {
    title: "",
    xaxis: {
      title: "",
      type: "category",
      tickangle: -45,
    },
    yaxis: {
      title: "NDVI avg.",
    },
    showlegend: true,
    margin: {
      t: 0, // top margin
      b: 50, // bottom margin
      l: 0, // left margin
      r: 0, // right margin
    },
    dragmode: null,
    height: height,
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      config={config}
      useResizeHandler={true}
      style={{ height: "100%" }}
    />
  );
};

export default DataChart;