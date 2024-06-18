import { useEffect, useState } from "react";
import DataChart from "../components/DataChart";

/**
 * Compares data across different years and displays it in a chart.
 *
 * @param {Array} dates - Array of objects containing date and statistical data.
 * @param {number} selectedYear - The year currently selected for comparison.
 * @param {Object} selectedDate - The date object selected for detailed view.
 * @param {number} height - The height of the chart.
 * @returns {JSX.Element} A component that renders the data comparison chart.
 */

function CompareYears({ dates, selectedYear, selectedDate, height }) {
  selectedDate = new Date(selectedDate.generationtime).toLocaleString();

  const [chartData, setChartData] = useState(null);

  const [graphData, setGraphData] = useState(null);
  const [mode, setMode] = useState("fill");

  useEffect(() => {
    const func = async () => {
      await compareYears();
    };

    func();
  }, [dates]);

  const getDatesOfYear = (dates, year) => {
    let filteredDates = dates.filter((item) => {
      return new Date(item.date).getFullYear() === year;
    });

    return filteredDates;
  };

  const getChartData = (dates) => {
    return dates.map((item, i) => {
      return { date: item.generationtime, mean: item.stats.average };
    });
  };

  const getYears = (chartData) => {
    let years = [
      ...new Set(chartData.map((item) => new Date(item.date).getFullYear())),
    ];

    years.sort((a, b) => {
      return b - a;
    });

    return years;
  };

  const compareYears = async () => {
    let chartData = getChartData(dates);

    let years = getYears(chartData);

    let datesOfYearS = [];
    years.map((year) => {
      let dates = getDatesOfYear(chartData, year);

      dates.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      datesOfYearS = [...datesOfYearS, { year: year, dates: dates }];
    });

    for (let item of datesOfYearS) {
      const tmp = item.dates.map((sitem) => ({
        date: new Date(sitem.date).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }),
        mean: sitem.mean,
      }));
      item.dates = tmp;
    }

    let allDates = [];

    for (let item of datesOfYearS) {
      const tmp = item.dates.map((item) => {
        return new Date(item.date).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
        });
      });

      allDates = [...allDates, ...tmp];
    }

    allDates = [...new Set(allDates)];
    const sortedDates = allDates.sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    const options = { day: "numeric", month: "numeric" };
    let x_labels = sortedDates.map((date) =>
      new Date(date).toLocaleDateString(undefined, options)
    );

    x_labels = x_labels.map((label) => label.slice(0, -1));

    const fillData = (datesOfYearS, sortedDates) => {
      const filledData = [];
      let dataIndex = 0;

      for (let i = 0; i < sortedDates.length; i++) {
        if (dataIndex < datesOfYearS.dates.length) {
          if (datesOfYearS.dates[dataIndex].date === sortedDates[i]) {
            filledData.push(datesOfYearS.dates[dataIndex].mean);
            dataIndex++;
          } else {
            filledData.push(null);
          }
        } else {
          filledData.push(null);
        }
      }

      return filledData;
    };

    let filledData = [];

    for (let i = 0; i < datesOfYearS.length; i++) {
      filledData = [
        ...filledData,
        {
          year: datesOfYearS[i].year,
          data: fillData(datesOfYearS[i], sortedDates),
        },
      ];
    }

    setChartData({ x_labels: x_labels, data: filledData });
  };

  return (
    <>
      {chartData !== null && (
        <div
          fluid
          className="pe-0 me-0 ms-0 mt-0"
          style={{ position: "relative" }}
        >
          <DataChart
            data={chartData}
            selectedYear={selectedYear}
            selectedDate={selectedDate}
            fill={mode === "fill" ? "tozeroy" : ""}
            height={height}
          />
        </div>
      )}
    </>
  );
}

export default CompareYears;
