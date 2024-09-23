import {
  IonButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToolbar,
} from "@ionic/react";
import {
  folderOpenSharp,
  listSharp,
  mapSharp,
  menuSharp,
} from "ionicons/icons";
import { Redirect, Route, useHistory } from "react-router";
import { useEffect } from "react";

import SideMenu from "../components/SideMenu/SideMenu";

import "./Home.scss";
import Projects from "./projects/Projects";
import { useAppSelector } from "../store/store";
import { selectCurrentGalaxy } from "../store/galaxies.slice";
function extractGalaxyIdFromPathname(pathname: string): string | undefined {
  let galaxyId: string | undefined;
  const path = pathname.split("/");
  if (path.length > 2) {
    const id = path[2];
    if (id.length > 20) {
      galaxyId = id;
    }
  }
  return galaxyId;
}

const Home: React.FC = () => {
  const version = "0.1.0";
  // const currentGalaxyId: string = useAppSelector(selectCurrentGalaxy)!;

  const history = useHistory();

  useEffect(() => {
    const galaxyId = extractGalaxyIdFromPathname(location.pathname);
    if (galaxyId) {
      // dispatch(setCurrentGalaxy(galaxyId));
    }
  }, []);

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      const galaxyId = extractGalaxyIdFromPathname(location.pathname);
      if (galaxyId) {
        // dispatch(setCurrentGalaxy(galaxyId));
      }
    });

    return () => {
      unlisten();
    };
  }, [history]);

  function toggleMenu() {
    const splitPane = document.querySelector("ion-split-pane");
    if (window.matchMedia("(min-width: 992px)").matches) {
      splitPane?.classList.toggle("split-pane-visible");
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div id="toolbar">
            <IonMenuToggle autoHide={false}>
              <IonButton fill="clear" onClick={toggleMenu}>
                <IonIcon icon={menuSharp} slot="icon-only" />
              </IonButton>
            </IonMenuToggle>

            <div className="logo hide-sm">
              <div id="logo-text" className="hide-md">
                Mnemo<span>fy</span>
              </div>
              <div id="version" className="hide-md">
                {version}
              </div>
            </div>
            <div className="header-middle"></div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <SideMenu />
        </IonMenu>
        <div className="ion-page" id="main">
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact path="/" to="/projects" />
              <Route path="/projects" render={() => <Projects />} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="projects" href={`/projects`}>
                <IonIcon icon={folderOpenSharp} />
                <IonLabel>Projects</IonLabel>
              </IonTabButton>
              <IonTabButton
                tab="map"
                // href={`/map/${currentGalaxyId}`}
                // disabled={!currentGalaxyId}
              >
                <IonIcon icon={mapSharp} />
                <IonLabel>Map</IonLabel>
              </IonTabButton>
              <IonTabButton
                tab="overview"
                // href={`/overview/${currentGalaxyId}`}
                // disabled={!currentGalaxyId}
              >
                <IonIcon icon={listSharp} />
                <IonLabel>Overview</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </div>
      </IonSplitPane>
    </IonPage>
  );
};

export default Home;
