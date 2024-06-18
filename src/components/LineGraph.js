import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Plot from "react-plotly.js";


/**
 * Renders a line graph using Plotly.js.
 *
 * @param {Object} _data - The data object containing x and y values.
 * @param {number} _selected - Index of the selected data point.
 * @param {string} [fill=""] - The fill option for the graph. Defaults to an empty string.
 * @param {number} height - The height of the graph. 
 */

const LineGraph = ({ _data, _selected, fill, height}) => {
  const [data, setData] = useState(null);

  if (fill === undefined) {
    fill = "";
  }

  useEffect(() => {
    if (_data !== null) {
      setData(getData(_data, _selected));
    }
  }, [_data, _selected]);

  function getData(_data, _selected) {
    return [
      {
        x: _data.x,
        y: _data.y,
        mode: "lines+markers",
        line: {
          color: "green",
          shape: "spline",
        },
        marker: {
          opacity: Array(_data.x.length)
            .fill(0)
            .map((item, i) => (i === _data.x.length - _selected ? 1 : 0)),
          color: _data.colors,
          size: 20,
        },

        type: "scatter",
        fill: fill,
      },
    ];
  }

  const config = {
    staticPlot: true,
    responsive: true,
    displayModeBar: false,
  };

  return (
    <Container className="ms-0 ps-0">
      {data !== null && (
        <Plot
          data={data}
          layout={{
            plot_bgcolor: "rgba(0, 0, 0, 0)",
            paper_bgcolor: "rgba(0, 0, 0, 0)",
            height: height,
            margin: {
              t: 0,
              r: 0,
              l: 45,
            },
            title: {
              text: null,
            },
            dragmode: null,

            yaxis: {
              gridcolor: "#333333",
              color: "#FFFFFF",
              showticklabels: true,
              title: {
                text: "NDVI avg.",
                font: {
                  color: "gray",
                },
              },
            },
            xaxis: {
              gridcolor: "#333333",
              color: "#008b8b",
              type: "string",
              showline: true,
              showticklabels: true,
              tickangle: 45,
            },
          }}
          config={config}
          useResizeHandler={true}
        />
      )}
    </Container>
  );
};

export default LineGraph;
