import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Plot from "react-plotly.js";

/**
 * BarGraph renders a bar graph using Plotly.js based on the provided data.
 * 
 * @param {Object} _data - The data object containing x and y values for the graph.
 * @param {number} _selected - The index of the selected bar in the graph.
 * @param {Function} callBack - The callback function to be called when a bar is clicked.
 * @param {number} height - The height of the graph container.
 * @param {boolean} collapsed - Indicates if the graph is collapsed or expanded.
 * @returns {React.ReactElement|null} - A container with the Plotly.js bar graph or null if no data is provided.
 */

const BarGraph = ({ _data, _selected, callBack, height, collapsed }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (_data !== null) {
      setData(getData(_data, _selected));
    }
  }, [_data, _selected]);

  if (_data === null) {
    return null;
  }

  function getData(_data, _selected) {
    return [
      {
        x: _data.x,
        y: _data.y,
        mode: "lines+markers",
        line: {
          color: "green",
        },
        marker: {
          opacity: Array(_data.x.length)
            .fill(0)
            .map((item, i) => (i === _data.x.length - _selected ? 1 : 0.7)),
          color: _data.colors,
          size: 20,
        },
        type: "bar",
      },
    ];
  }

  const config = {
    staticPlot: false,
    responsive: true,
    displayModeBar: false,
    scrollZoom: false,
  };

  const handleBarClick = (event) => {
    const pointIndex = event.points[0].pointIndex;

    callBack(_data.x.length - pointIndex - 1);
  };

  return (
    <Container className="ms-0 ps-0">
      {data !== null && (
        <Plot
          data={data}
          onClick={(e) => handleBarClick(e)}
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
            dragmode: "null",

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
              tickangle: 45,
              ticktext: data[0].x,
            },
          }}
          config={config}
          useResizeHandler={true}
        />
      )}
    </Container>
  );
};

export default BarGraph;
