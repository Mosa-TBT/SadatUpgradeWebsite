import PropTypes from "prop-types";
import { RiArrowRightUpLine } from "react-icons/ri";
import "./Article.css";

const Article = ({ imgUrl, date, title }) => {
  return (
    <article className="article">
      <div className="article__image">
        <img src={imgUrl} alt={title} />
      </div>
      <div className="article__content">
        <p className="article__date">{date}</p>
        <h3>{title}</h3>
        <p className="article__link">
          Read Full Article
          <RiArrowRightUpLine aria-hidden="true" />
        </p>
      </div>
    </article>
  );
};

Article.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Article;
