import DataForm from "../components/dataform/DataForm";

/**
 * Displays statistical data in a form layout.
 *
 * @param {Array} data - An array of data points to be displayed, which will be reversed for rendering.
 * @param {number} selectedIndex - The index of the currently selected data point.
 * @param {Function} setSelectedIndex - A function to update the selected index state.
 * @returns {JSX.Element} A DataForm component populated with the provided data and configuration.
 */

const Statistics = ({ data, selectedIndex, setSelectedIndex }) => {
  data = [...data].reverse();

  const header = ["Date", "Average", " ", "Max", "Min", "StdDev"];

  return (
    <DataForm
      data={data}
      header={header}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
    />
  );
};

export default Statistics;
