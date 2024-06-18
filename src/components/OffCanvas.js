import { Button, Offcanvas } from "react-bootstrap";
import NDVIFilm from "./BasicFilm";
import { ChevronCompactDown } from "react-bootstrap-icons";


/**
 * Renders an off-canvas component for displaying NDVI filmstrip images.
 *
 * @param {Array} imagesOfYear - An array of image data for the year.
 * @param {number} activeIndex - The index of the currently active image.
 * @param {Function} setIndex - The function to update the active image index.
 * @param {boolean} show - Controls the visibility of the off-canvas.
 * @param {Function} visible - The function to update the visibility state.
 * @param {boolean} collapsed - Indicates if the off-canvas is collapsed.
 */

const OffCanvas = ({
  imagesOfYear,
  activeIndex,
  setIndex,
  show,
  visible,
  collapsed,
}) => {
  return (
    <Offcanvas
      show={show}
      placement={"bottom"}
      autoFocus={false}
      enforceFocus={false}
      backdrop={false}
      scroll={false}
      data-bs-theme="dark"
      style={{ height: "fit-content" }}
    >
      <Offcanvas.Body>
        <div className="text-end">
          <Button
            size="sm"
            variant="outline-info"
            onClick={() => visible(false)}
          >
            <ChevronCompactDown color="darkcyan" size={20} />
          </Button>
        </div>

        <NDVIFilm
          imageData={imagesOfYear}
          activeIndex={activeIndex}
          dot={{
            selectedColor: "#00FF00",
            color: "#00FFFF33",
            size: 8,
          }}
          callBack={setIndex}
          collapsed={collapsed}
        />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffCanvas;
