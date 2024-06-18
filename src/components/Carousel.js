
import { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";

/**
 * A carousel component for displaying NDVI images.
 * 
 * @param {Object[]} imageData - Array of image objects to display in the carousel.
 * @param {number} activeIndex - The index of the currently active item in the carousel.
 * @param {number|null} interval - The amount of time to delay between automatically cycling an item. If null, carousel will not automatically cycle.
 * @param {function} callBack - Function to be called when a new slide is selected.
 * @param {boolean} mobile - Flag indicating if the carousel is being used on a mobile device.
 * @returns {React.ReactElement} A carousel component with NDVI images.
 */

const NDVICarousel = ({
  imageData,
  activeIndex,
  interval,
  callBack,
  mobile,
}) => {
  const [index, setIndex] = useState(null);

  /**
   * Handler for when a new slide is selected.
   * 
   * @param {number} selectedIndex - The index of the new selected slide.
   */

  const onSelect = (selectedIndex) => {
    callBack(selectedIndex);
  };

  return (
    <div>
      {imageData.length > 0 && (
        <Carousel
          activeIndex={activeIndex}
          interval={interval}
          slide={false}
          onSelect={onSelect}
        >
          {imageData.map((item, index) => (
            <Carousel.Item key={index}>
              <img
                src={item.image.dataUrl}
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginBottom: "62px",
                  height: mobile ? "250px" : undefined,
                }}
              />

              <Carousel.Caption style={{ color: "white" }}>
                {new Date(item.id.split("_")[0]).toLocaleDateString()}
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default NDVICarousel;
