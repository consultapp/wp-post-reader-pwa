import { Link } from "react-router-dom";
import styles from "./style.module.scss";
import { sendMessageToSW } from "../../utils/functions";
import { useState } from "react";

export default function Menu({ isOpen, toggleButton }) {
  const [regularNotifications, setRegularNotifications] = useState(false);
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
          {!regularNotifications && (
            <li
              id="menu-item-1530"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1530"
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  console.log("start");
                  sendMessageToSW("START_SHOW_INTERVAL_NOTIFICATIONS", {});
                  setRegularNotifications(true);
                }}
              >
                Start Notif
              </a>
            </li>
          )}
          {regularNotifications && (
            <li
              id="menu-item-1530"
              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1530"
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  console.log("end");
                  sendMessageToSW("END_SHOW_INTERVAL_NOTIFICATIONS", {});
                  setRegularNotifications(false);
                }}
              >
                End Notif
              </a>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
