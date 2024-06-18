import Plot from "react-plotly.js";
import "./css/scale.css";

/**
 * Renders a bar chart using Plotly.js.
 * 
 * @param {Object} parameters - The parameters for the scale.
 * @param {number} width - The width of the chart.
 * @param {number} height - The height of the chart.
 * @param {Array.<{amount: number, color: string}>} parameters.data - The data to be displayed, each item includes an amount and a color.
 * @returns {JSX.Element|null} The Plotly.js chart component or null if parameters are not provided.
 */

const Scale = ({ params, width, height }) => {
  if (params === null) {
    return null;
  }

  const data = params.map((item, index) => {
    return {
      x: [""],
      y: [item.amount],
      type: "bar",
      text: [item.amount],
      textposition: "inside",
      insidetextanchor: "middle",
      texttemplate: `<span class="bar-text">${item.amount}</span>`,
      marker: {
        color: item.color,
      },
    };
  });

  const layout = {
    autosize: true,
    barmode: "stack",
    bgcolor: "rgba(0, 0, 0, 0)",
    width: width,
    height: height,
    dragmode: false,
    zoom: false,
    hovermode: false,
    bargap: 0,
    bargroupgap: 0,

    yaxis: {
      showticklabels: false,
      range: [0, 100],
      side: "right",
      showgrid: false,
      zeroline: false,
    },
    xaxis: {
      showticklabels: false,
      zeroline: false,
    },

    showlegend: false,
    responsive: true,

    margin: {
      t: 0,
      r: 0,
      b: 0,
      l: 0,
    },
  };

  const config = {
    displayModeBar: false,
    displaylogo: false,
    editable: false,
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      useResizeHandler={true}
      style={{ padding: 0, margin: 0 }}
    />
  );
};

export default Scale;
