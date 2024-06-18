import React, { useState, useEffect, useRef } from "react";
import Row from "./Row";
import { Table, Form } from "react-bootstrap";
import "./css/form.css";

const DataForm = ({ data, header, selectedIndex, setSelectedIndex }) => {

  useEffect(() => {
    if (selectedIndex !== null) {
      scrollToLine(selectedIndex);
      
    }
  }, [selectedIndex]);

  const itemRefs = useRef([]);

  const handleRow = (selectedIndex) => {
    setSelectedIndex(data.length - selectedIndex - 1);
  };

  const HeaderRow = ({ header }) => {
    return (
      <thead style={{position: "sticky",top: 0 }} ref={(el) => {
        itemRefs.current[data.length] = el;        
      }}>
        <tr>
          {header.map((item, ind) => {
            return (
              <td key={ind} style={{ background: "#2A2E3E", color: "#B2B7BA" }}>
                {item}
              </td>
            );
          })}
        </tr>
      </thead>
    );
  };

  const rgbValue = (val) => {
    let color = [];

    if (val >= 0.15 && val < 0.3)
      color = [0.9568627450980393, 0.2627450980392157, 0.21176470588235294];
    else if (val < 0.45) color = [1.0, 0.596078431372549, 0.0];
    else if (val < 0.6) color = [1.0, 0.9215686274509803, 0.23137254901960785];
    else if (val >= 0.6)
      color = [0.2980392156862745, 0.6862745098039216, 0.3137254901960784];
    else color = [];

    color = color.map((num) => Math.round(num * 255));
    color.push(val);

    return color;
  };


  const scrollToLine = (index) => {

    itemRefs.current[index].scrollIntoView({
      behavior: "smooth",
      //block: "nearest",
      block: "end",
      inline: "start",
    });
  };


  return (
    <Form>
      <Table hover className="table table-sm table-success" responsive="sm">
        {data.length > 0 && <HeaderRow header={header} />}
        {data.length > 0 &&
          data.map((item, index) => {
            return (
              <tbody
                ref={(el) => {
                  itemRefs.current[data.length - index - 1] = el;
                }}
              >
                <Row
                  key={index}
                  id={index}
                  rowData={[
                    new Date(item.id.split("_")[0]).toLocaleDateString(),
                    item.average,
                    rgbValue(item.average),
                    item.max,
                    item.min,
                    item.std,
                  ]}
                  selectedIndex={data.length - selectedIndex - 1}
                  setSelectedIndex={handleRow}                  
                />
              </tbody>
            );
          })}
      </Table>
    </Form>
  );
};
export default DataForm;