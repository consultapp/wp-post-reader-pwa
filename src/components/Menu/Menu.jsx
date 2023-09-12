import { Link } from "react-router-dom";
import styles from "./style.module.scss";

export default function Menu({ isOpen, toggleButton }) {
  return (
    <nav
      className="menu menu-primary font-secondary"
      role="navigation"
      id="menu-primary"
      itemScope="itemScope"
      itemType="http://schema.org/SiteNavigationElement"
    >
      <button
        id="menu-toggle"
        className={`menu-toggle hamburger hamburger--spin main-menu-btn is-not-active font-secondary ${styles.buttonHamburger}`}
        type="button"
        onClick={() => {
          toggleButton(isOpen);
        }}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
        <span className="screen-reader-text">Menu</span>
      </button>
      {isOpen && (
        <ul id="menu-primary-items" className="menu-items sm sm-simple">
          <li
            id="menu-item-1530"
            className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1530"
          >
            <Link to="/">Статьи</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
