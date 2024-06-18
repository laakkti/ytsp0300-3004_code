import Plot from "react-plotly.js";

/**
 * Displays a graph of cumulative temperature over time.
 * 
 * @param {Array} data - Array of objects containing date and temperature values.
 * @param {number} height - The height of the graph.
 * @param {boolean} collapsed - Indicates if the graph is collapsed, affecting the font size.
 * @returns {ReactElement|null} The CumulativeTemperatureGraph component or null if no data.
 */

const CumulativeTemperatureGraph = ({ data, height,collapsed }) => {
  
  if (data) {
    const timestamps = data.map((item) => item.date);
    const cumulativeTemperatures = data.map((item,index) => item.temp-(index + 1) * 273.15);

    const config = {
        staticPlot: true,
        responsive: true,
        displayModeBar: false 
    };
    
    return (
      <div>
      <Plot        
        data={[
          {
            x: timestamps,
            y: cumulativeTemperatures,
            type: "scatter",
            mode: "lines",
            name: "Cumulative Temperature",
            line: {
              color: "red",
            },
          },
        ]}
        layout={{
          margin: {
            t: 30, // Top margin (adjust value as needed)
            b: 40
          },
          height:height,
          plot_bgcolor: "rgba(0, 0, 0, 0)",
          paper_bgcolor: "rgba(0, 0, 0, 0)",
          
          title: {
            text: "Cumulative Temperature",
            font: {
              color: "gray",
              size: collapsed ? 14 : undefined
            }
          },

          
          xaxis: {
            gridcolor: "#333333",
            color: "#f9e9d9",
          },

          yaxis: {
            gridcolor: "#333333",
            color: "#f9e9d9",
            title: {
              text: "Cumulative Temperature (°C)",
              font: {
                color: "gray",
                 
              }
            },
            zeroline:false
          },

          
          dragmode: null
        }}
        config={config}
        useResizeHandler={true}
        //style={{width: "50%", height: "50%" }}
        style={{height: "100%" }}
      />
      </div>
    );
  } else {
    return null;
  }
};

export default CumulativeTemperatureGraph;
