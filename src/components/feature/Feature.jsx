import PropTypes from "prop-types";
import "./Feature.css";

const Feature = ({ title, text }) => {
  return (
    <div className="feature">
      <div className="feature__title">
        <div />
        <h3>{title}</h3>
      </div>
      <div className="feature__text">
        <p>{text}</p>
      </div>
    </div>
  );
};

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Feature;
