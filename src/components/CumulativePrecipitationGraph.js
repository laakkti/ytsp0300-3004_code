import Plot from "react-plotly.js";

/**
 * Displays a graph of cumulative precipitation over time.
 * 
 * @param {Array} data - Array of objects containing date and rain values.
 * @param {number} height - The height of the graph.
 * @param {boolean} collapsed - Indicates if the graph is collapsed, affecting the font size.
 * @returns {ReactElement|null} The CumulativePrecipitationGraph component or null if no data.
 */

const CumulativePrecipitatioGraph = ({ data, height, collapsed }) => {
  if (data) {
    const timestamps = data.map((item) => item.date);
    const cumulativePrecipitation = data.map((item) => item.rain);

    const config = {
      staticPlot: true,
      responsive: true,
      displayModeBar: false,
    };

    return (
      <Plot
        data={[
          {
            x: timestamps,
            y: cumulativePrecipitation,
            type: "scatter",
            mode: "lines",
            name: "Cumulative Precipitation",
            line: {
              color: "blue",
            },
          },
        ]}
        layout={{
          plot_bgcolor: "rgba(0, 0, 0, 0)",
          paper_bgcolor: "rgba(0, 0, 0, 0)",
          margin: {
            t: 30,
            b: 40,
          },
          height: height,

          title: {
            text: "Cumulative Precipitation",
            font: {
              color: "gray",
              size: collapsed ? 14 : undefined,
            },
          },

          xaxis: {
            gridcolor: "#333333",
            color: "#f9e9d9",
            zeroline: false,
          },

          yaxis: {
            gridcolor: "#333333",
            color: "#f9e9d9",
            title: {
              text: "Cumulative Precipitation (mm)",
              font: {
                color: "gray", // Change this to the desired color for y-axis title
              },
            },
            zeroline: false,
          },

          dragmode: null,
        }}
        config={config}
        useResizeHandler={true}
        style={{ height: "100%" }}
      />
    );
  } else {
    return null;
  }
};

export default CumulativePrecipitatioGraph;
