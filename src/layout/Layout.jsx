import HeaderContainer from "../containers/Header/Header";
import FooterContainer from "../containers/Footer/Footer";
import Workarea from "../components/Workarea/Workarea";
import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import EventListeners from "../containers/EventSWListeners/EventSWListeners";

export default function Layout({ children }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <EventListeners />
      <HeaderContainer />
      <Workarea>{children}</Workarea>
      <FooterContainer />
    </>
  );
}
