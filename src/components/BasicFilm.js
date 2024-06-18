import React, { useState, useEffect, useRef } from "react";
import BasicFilm, { createBasicStyleSet } from "react-film";

/**
 * NDVIFilm renders a scrollable filmstrip of images using react-film.
 * 
 * @param {Object[]} imageData - An array of image objects to display in the filmstrip.
 * @param {number} activeIndex - The index of the currently active image.
 * @param {Object} dot - An object containing properties for the dot size and colors.
 * @param {Function} callBack - The function to call when an image is clicked.
 * @param {boolean} collapsed - Indicates if the filmstrip is collapsed or expanded.
 * @returns {React.ReactElement|null} - A filmstrip of images or null if imageData is not provided.
 */

const NDVIFilm = ({ imageData, activeIndex, dot, callBack, collapsed }) => {
  const film = useRef();
  const [imageHeight, setImageHeight] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);

  const itemRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(activeIndex);

  useEffect(() => {
    if (activeIndex !== null && activeIndex !== focusedIndex) {
      scrollToItem(activeIndex);
    }
  }, [activeIndex]);

  const scrollToItem = (index) => {
    setFocusedIndex(index);
    itemRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const styleSet = createBasicStyleSet({ dotSize: dot.size });
  const myStyleSet = {
    ...styleSet,

    root: {
      ...styleSet.root,

      "& .react-film__dot .react-film__dot__handle": {
        backgroundColor: dot.color,
      },
      // selected dot background color
      "& .react-film__dot .react-film__dot__input:checked:not(:active) + .react-film__dot__handle":
        {
          backgroundColor: dot.selectedColor,
        },
    },
  };

  const handleImageLoad = (event) => {
    const height = event.target.height + 30; // 30 labelin korkeus
    const width = event.target.width;
    setImageHeight(height);
    setImageWidth(width);
  };

  const onClick = (event) => {
    let index = event.target.id;
    callBack(parseInt(index));
    setFocusedIndex(index);
  };

  return (
    imageData && (
      <div>
        <div>
          <BasicFilm
            ref={film}
            height={imageHeight}
            styleSet={myStyleSet}
            showDots={true}
            showScrollBar={true}
          >
            {imageData.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  id={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  src={item.image.dataUrl}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: !collapsed ? "105px" : "75px",
                    height: "*",
                    border:
                      focusedIndex === index ? "3px solid #0d6efd" : "none",
                  }}
                  onLoad={handleImageLoad}
                  onClick={onClick}
                />
                <label style={{ color: "#00FFDD", fontSize: "13px" }}>
                  {new Date(item.id.split("_")[0]).toLocaleDateString()}
                </label>
              </div>
            ))}
          </BasicFilm>
        </div>
      </div>
    )
  );
};

export default NDVIFilm;
