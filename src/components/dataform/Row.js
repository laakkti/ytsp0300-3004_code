import React from "react";

const Row = ({ id, rowData, selectedIndex, setSelectedIndex, setRef }) => {
  function onSelect(e) {
    setSelectedIndex(e.target.parentNode.id);
  }

  return (
    <tr id={id} onClick={onSelect}>
      {rowData.map((item, ind) => {
        return ind === 2 ? (
          <td
            key={ind}
            style={{
              background: `rgb(${item[0]}, ${item[1]}, ${item[2]})`,
              textAlign: "left",
              width: "0.5%",
            }}
          >
            &nbsp;&nbsp;&nbsp;
          </td>
        ) : ind === 1 ? (
          <td
            key={ind}
            style={
              id === selectedIndex
                ? { background: "#c5d5cd", width: "5%" }
                : { width: "5%" }
            }
          >
            {" "}
            {item}{" "}
          </td>
        ) : ind === 0 ? (
          <td
            key={ind}
            style={
              id === selectedIndex ? { background: "#c5d5cd" } : { width: "5%" }
            }
          >
            {" "}
            {item}{" "}
          </td>
        ) : (
          <td
            key={ind}
            style={
              id === selectedIndex
                ? { background: "#c5d5cd" }
                : { width: "10%" }
            }
          >
            {" "}
            {item}{" "}
          </td>
        );
      })}
    </tr>
  );
};
export default Row;
