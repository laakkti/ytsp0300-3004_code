import { useEffect, useState } from "react";
import { Button, Stack, Container, ButtonGroup, Row } from "react-bootstrap";

import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";


/**
 * Displays a chart that can toggle between a line graph and a bar graph.
 *
 * @param {Array} datesOfYear - Array of objects containing date and statistical data.
 * @param {number} selectedIndex - Index of the selected data point.
 * @param {Function} callBack - Callback function to be executed on certain actions.
 * @param {number} height - Height of the chart.
 * @param {boolean} collapsed - State to indicate if the application is collapsed.
 * @returns {JSX.Element} A container with the chart and toggle buttons.
 */

function Chart({ datesOfYear, selectedIndex, callBack, height, collapsed }) {
  const [graphData, setGraphData] = useState(null);
  const [mode, setMode] = useState("line");

  useEffect(() => {
    if (datesOfYear !== null) {
      const rgbValue = (val) => {
        let color = [];

        if (val < 0.3)
          color = [0.9568627450980393, 0.2627450980392157, 0.21176470588235294];
        else if (val < 0.45) color = [1.0, 0.596078431372549, 0.0];
        else if (val < 0.6)
          color = [1.0, 0.9215686274509803, 0.23137254901960785];
        else if (val >= 0.6)
          color = [0.2980392156862745, 0.6862745098039216, 0.3137254901960784];
        else color = [];

        color = color.map((num) => Math.round(num * 255));

        return color;
      };

      let _datesOfYear = [...datesOfYear].reverse();

      let data = [];
      data[0] = _datesOfYear.map((item) => {
        return new Date(item.generationtime).toLocaleDateString();
      });
      data[1] = _datesOfYear.map((item) => {
        return item.stats.average;
      });

      let colors = [];
      colors = data[1].map((average, i) => {
        return `rgb(${rgbValue(average)})`;
      });

      setGraphData({ x: data[0], y: data[1], colors: colors });
    }
  }, [datesOfYear]);

  return (
    <Container
      fluid
      className="pe-0 me-0 ms-0 mt-0"
      style={{ position: "relative" }}
    >
      {mode === "line" ? (
        <LineGraph
          _data={graphData}
          _selected={selectedIndex + 1}
          fill=""
          height={height}
          collapsed={collapsed}
        />
      ) : (
        <BarGraph
          _data={graphData}
          _selected={selectedIndex + 1}
          callBack={callBack}
          height={height}
          collapsed={collapsed}
        />
      )}

      <ButtonGroup
        size="sm"
        variant="success"
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        <Button onClick={() => setMode("line")} active={mode === "line"}>
          Line
        </Button>
        <Button onClick={() => setMode("bar")} active={mode === "bar"}>
          Bar
        </Button>
      </ButtonGroup>
    </Container>
  );
}

export default Chart;
