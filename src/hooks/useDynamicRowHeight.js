import { useState, useEffect } from "react";

/**
 * A custom hook to calculate and track the height of a row element and the remaining height below it.
 *
 * @param {Object} rowRef - A React ref object attached to the row element whose height is to be tracked.
 * @param {boolean} initialized - A flag indicating whether the component using this hook has been initialized.
 * @returns {Object} An object containing the current row height and the calculated remaining height below the row.
 */

const useDynamicRowHeight = (rowRef, initialized) => {
  const [rowHeight, setRowHeight] = useState(0);
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const [calculatingHeight, setCalculatingHeight] = useState(true);

  const handleResize = () => {
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      const height = rowRef.current.clientHeight;
      setRowHeight(height);

      console.log(window.innerHeight + " - " + rect.top + " -  " + height);
      if (rect.top > 0) {
        setLastRowHeight(window.innerHeight - rect.top - height);
        setCalculatingHeight(false);
      }else{
        setCalculatingHeight(true);
      }
    }
  };

  useEffect(() => {
    //if (initialized) handleResize();
    handleResize();
  }, [initialized]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [rowRef]);

  return { rowHeight, lastRowHeight,calculatingHeight };
};

export default useDynamicRowHeight;
