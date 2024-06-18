import { useState, useEffect } from "react";
import Slider from "@appigram/react-rangeslider";
import "@appigram/react-rangeslider/lib/index.css";
import "./css/slider.css";

/**
 * Renders a slider component with customizable range and step values.
 *
 * @param {number} min - The minimum value of the slider.
 * @param {number} max - The maximum value of the slider.
 * @param {number} value - The current value of the slider.
 * @param {number} step - The step increment of the slider.
 * @param {Function} callBack - The function to call when the value changes.
 */

const MySlider = ({ min, max, value, step, callBack }) => {
  const [_value, setValue] = useState(null);

  useEffect(() => {
    if (value !== _value) {
      setValue(value);
    }
  }, [value]);

  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={_value}
      onChange={callBack}
    />
  );
};

export default MySlider;
