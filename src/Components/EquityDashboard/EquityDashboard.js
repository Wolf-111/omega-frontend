import React, { useEffect, useRef, useState } from "react";
import { useStorageState } from "../../hooks/useStorageState";
import _ from "lodash";
import "../../App.scss";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import Tour from "reactour";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { useHistory } from "react-router";
import uuid from "react-uuid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Popover } from "antd";
import Loader from "react-loader-spinner";
import Earnings from "../Cards/Earnings";
import AnalystRecommendations from "../Cards/AnalystRecommendations";
import Dividends from "../Cards/Dividends";
import Price from "../Cards/Price";
import PriceTarget from "../Cards/PriceTarget";
import RiskAnalysis from "../Cards/RiskAnalysis";
import Sidenavbar from "../Navbars/Sidenavbar";
import UndoPrompt from "./UndoPrompt";
import TickerHeader from "./TickerHeader";
import DashboardNavbar from "../Navbars/DashboardNavbar";
import News from "../Cards/News";
import PriceCalendar from "../Cards/PriceCalendar";
import OverallReturns from "../Cards/OverallReturns";
import AverageReturns from "../Cards/AverageReturns";
import EarningsRatio from "../Cards/EarningsRatio";
import Valuation from "../Cards/Valuation";
import Volatility from "../Cards/Volatility";
import { useAuth0 } from "@auth0/auth0-react";
import db from "../../firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const GridLayout = WidthProvider(Responsive);

const HomeDashboard = (props) => {
  let { userID, dashboardID } = useParams();

  const { isLoading, isAuthenticated, loginWithRedirect, user } = useAuth0();

  // mainLayout is the default layout that the user will see when they first load the page
  // It consists of x amount cards identified by their id (i). They are assigned their default
  // widths, heights, and (x, y) positions on the grid
  const [mainLayout, setMainLayout] = useState([
    { i: "6", x: 0, y: 0, w: 6, h: 1, minW: 3, maxH: 1 },
    { i: "2", x: 6, y: 0, w: 6, h: 1, minW: 3, maxH: 1 },
    { i: "8", x: 0, y: 0, w: 12, h: 1, minW: 3, maxH: 1 },
    { i: "10", x: 0, y: 0, w: 3, h: 1, minW: 3, maxH: 1 },
    { i: "14", x: 3, y: 0, w: 3, h: 1, minW: 3, maxH: 1 },
    { i: "4", x: 6, y: 0, w: 6, h: 1, minW: 3, maxH: 1 },
  ]);
  const [newLayout, setNewLayout] = useState({});
  const [newLayoutName, setNewLayoutName] = useState();
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState(0);
  const [wasTaken, setWasTaken] = useState(false);
  const [wasSelected, setWasSelected] = useState();
  const [value, setValue] = useState(true);
  const [wasRemoved, setWasRemoved] = useState(false);
  const [removedCard, setRemovedCard] = useState();
  const [preRemovedLayout, setPreRemovedLayout] = useState([]);
  const [undoClicked, setUndoClicked] = useState(false);
  const [darkMode, setDarkMode] = useState();
  const [theme, setTheme] = useState("");
  const [textColor, setTextColor] = useState("");
  const [isTourOpen, setIsTourOpen] = useState(true);

  useEffect(() => {
    darkMode ? setTheme("#000000") : setTheme("#FFFFFF");
    darkMode ? setTextColor("#FFFFFF") : setTextColor("#000000");
  }, [darkMode]);

  const [isUserNewStatus, setIsUserNewStatus] = useStorageState(
    true,
    "isUserNew"
  );

  if (localStorage.getItem("isUserNew") == null) {
    localStorage.setItem("isUserNew", true);
  }

  // This checks to see if the current user has a saved_dashboards collection.
  // If not, create one and set mainLayout as the default
  useEffect(() => {
    if (isAuthenticated) {
      const data = db.collection("saved_dashboards").doc(userID);

      data.get().then((docSnapshot) => {
        if (!docSnapshot.exists) {
          data.set({
            id: userID,
            dashboards: [{ [uuid()]: { "Default Layout": mainLayout } }],
          });
        } else {
          docSnapshot.data().dashboards.map((el) => {
            let f = Object.values(el)[0];
            let keys = Object.keys(f);

            keys.forEach((key) => {
              if (key == dashboardID) {
                // If a layout was selected from the Sidenavbar, turn the item dashboard from firebase into an array,
                let mappedLayoutIndex = Object.values(f[key])
                  .flat()
                  .map((card) => {
                    return parseInt(card.i);
                  });

                setMainLayout(
                  f[key],
                  props.setSelectedCardsIndex(mappedLayoutIndex)
                );
              }
            });
          });
        }
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isTourOpen) setIsUserNewStatus(false);
  }, [isTourOpen]);

  useEffect(() => {
    if (!isUserNewStatus) setIsTourOpen(false);
  }, [isUserNewStatus]);

  // Saves a new layout to state whenever the user edits the current one. This will be called
  // every time a card is moved, resized, deleted, or added
  const handleLayoutChange = (layout) => {
    let debounced = _.debounce(() => {
      return setNewLayout(layout), 100;
    });
    debounced();
  };

  // We use a ref to make sure that this useEffect hook is NOT called on the
  // initial render of the page. Only when the state value of newLayoutName changes
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (isAuthenticated) {
        var docRef = db.collection("saved_dashboards").doc(userID);
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              let dashboards = Object.values(doc.data().dashboards);

              let mappedDashboards = dashboards.flatMap((el) => {
                return Object.keys(Object.values(el)[0]);
              });

              // Checks to see if the layoutName already exists.
              // If not, save the layout & the layoutName to firebase
              if (!mappedDashboards.includes(newLayoutName)) {
                // newLayout has some undefined values, so we automatically remove them here.
                let newLayoutExcludeUndefined = newLayout.map((card) => {
                  Object.keys(card).forEach(
                    (key) => card[key] === undefined && delete card[key]
                  );
                  return card;
                });

                db.collection("saved_dashboards")
                  .doc(userID)
                  .set(
                    {
                      id: userID,
                      dashboards: firebase.firestore.FieldValue.arrayUnion({
                        [uuid()]: {
                          [newLayoutName]: newLayoutExcludeUndefined,
                        },
                      }),
                    },
                    { merge: true }
                  )
                  .then(() => {
                    console.log("Document successfully written!");
                  })
                  .catch((error) => {
                    console.error("Error writing document: ", error);
                  });
                setWasTaken(false);
              } else {
                setWasTaken(true);
                return;
              }
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      }
    }
  }, [newLayoutName]);

  const routerHistory = useHistory();
  // If a layout was selected from the SideNav, change the mainLayout to whatever they selected.
  if (wasSelected) {
    let docRef = db.collection("saved_dashboards").doc(userID);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          let data = doc.data().dashboards[selectedLayoutIndex];
          if (data) {
            let currentLayout = Object.values(data)[0];
            console.log(data);

            // If a layout was selected from the Sidenavbar, turn the item dashboard from firebase into an array,
            let mappedLayoutIndex = Object.values(currentLayout)
              .flat()
              .map((card) => {
                return parseInt(card.i);
              });

            let selectedLayoutName = Object.keys(currentLayout).flat()[0];
            routerHistory.push(`/dashboard/${userID}/${selectedLayoutName}`);

            // We setMainlayout to a null array
            setMainLayout([], setWasSelected(false));
            console.log(mappedLayoutIndex);
            // Set mainLayout to the layout that the user selected.
            setTimeout(() => {
              setMainLayout(
                Object.values(currentLayout).flat(),
                props.setSelectedCardsIndex(mappedLayoutIndex)
              );
            });
          }
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  const shareDashboard = () => {
    db.collection("shared_dashboards")
      .doc()
      .set({
        belongs_to: userID,
        dashboard: mainLayout,
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const removeCardFromLayout = (id) => {
    // Card was selected, remove it
    if (props.selectedCardsIndex.includes(id)) {
      props.setSelectedCardsIndex((prevSelected) =>
        prevSelected.filter((cardId) => cardId !== id)
      );
      setWasRemoved(true);
      setRemovedCard(id);
      setPreRemovedLayout(newLayout);
    }
  };

  useEffect(() => {
    let undoTimeout;

    // If a card was removed, setWasRemoved to false after a 5 second period
    if (wasRemoved) {
      undoTimeout = setTimeout(() => {
        setWasRemoved(false);
      }, 5000);
    }

    // If the Undo button was clicked on the UndoPrompt, set the
    // layout back to how it was before the user removed the card
    if (undoClicked) {
      setMainLayout((prevLayout) => [...prevLayout, preRemovedLayout]);
      setWasRemoved(false);
      setUndoClicked(false);
    }

    return function cleanup() {
      clearTimeout(undoTimeout);
    };
  }, [wasRemoved, undoClicked]);

  const availableCardsObject = {
    Earnings,
    AnalystRecommendations,
    Dividends,
    Price,
    PriceTarget,
    RiskAnalysis,
    News,
    PriceCalendar,
    OverallReturns,
    AverageReturns,
    EarningsRatio,
    Valuation,
    Volatility,
  };

  var layout = { lg: value === true ? mainLayout : mainLayout };

  const steps = [
    {
      selector: "body",
      content: "Welcome to sigma7! We are going to go through a short tour.",
      style: {
        backgroundColor: theme,
        border: `1px solid ${textColor}`,
      },
    },
    {
      selector: ".ticker-header",
      content:
        "This is where you can find general information about the company you're researching.",
      style: {
        backgroundColor: theme,
        border: `1px solid ${textColor}`,
      },
    },
    {
      selector: ".risk-card",
      content:
        "This is the Performance Card. This card gives detail on a company's overall risk adjusted performance. More specifically, it compares its returns to the risk it took to obtain these returns and computes this onto a simple meter.",
      style: {
        backgroundColor: theme,
        border: `1px solid ${textColor}`,
      },
    },

    {
      selector: ".analystrecs-card",
      content:
        "This is the Analyst Recommendations card. This card gives displays a broad overview of Wall Street's recommendations on a stock. These recommendations usually dictate whether or not one should buy, sell, or hold a stock.",
      style: {
        backgroundColor: theme,
        border: `1px solid ${textColor}`,
      },
    },
    {
      selector: ".news-card",
      content: "This is the News Card. Live aggregated news will appear here.",
      style: {
        backgroundColor: theme,
        border: `1px solid ${textColor}`,
      },
    },
    {
      selector: ".overallreturns-card",
      content:
        "This is the Overall Returns card. This card displays the ratio of days that a company went up versus the ratio of days a company went down.",
      style: {
        backgroundColor: theme,
        border: `1px solid ${textColor}`,
      },
    },
    {
      selector: ".volatility-card",
      content:
        "This is the Volatility Card. Volatility is usually defined as variation in stock returns. More specifically, a volatile stock tends to go up and down drastically. Many investors associate risk with volatility. The Volatility Card compares the company in question with its competitors and the market at large (DOW 30).",
      style: {
        backgroundColor: theme,
        border: `1px solid ${textColor}`,
      },
    },
    {
      selector: ".price-card",
      content:
        "This is the Price Card. Mouse over specific candles and dates to get more info on the data!. Likewise, there are configuration buttons below to change the time horizon and time frame.",
      style: {
        backgroundColor: theme,
        border: `1px solid ${textColor}`,
      },
    },
  ];
  const url = window.location.href;
  // Display a loading icon while the page is loading. Check if the user
  // is authenticated. If true, load the page. Otherwise, prompt them to login.
  if (isLoading) {
    return (
      <Loader
        className="fullyCentered"
        type="Puff"
        color="#007bff"
        height={100}
        width={100}
      />
    );
  } else {
    if (isAuthenticated) {
      return (
        <div>
          <DashboardNavbar
            availableCards={props.availableCards}
            setAvailableCards={props.setAvailableCards}
            selectedCardsIndex={props.selectedCardsIndex}
            setSelectedCardsIndex={props.setSelectedCardsIndex}
            setActiveTicker={props.setActiveTicker}
            activeTicker={props.activeTicker}
            isAuthenticated={isAuthenticated}
            wasTaken={wasTaken}
            setDarkMode={setDarkMode}
            darkMode={darkMode}
            setIsTourOpen={setIsTourOpen}
            setNewLayoutName={setNewLayoutName}
          />

          <h1 className="center header">Equity Dashboard</h1>
          <button onClick={shareDashboard} className="btn btn-primary">
            Share Dashboard
          </button>

          <CopyToClipboard text={url}>
            <button className="btn btn-primary">Copy Link</button>
          </CopyToClipboard>

          {/* TickerHeader goes here */}
          <TickerHeader tickerCard={props.availableCards[0]} />

          {/* Sidenavbar goes here */}
          <Sidenavbar
            setSelectedLayoutIndex={setSelectedLayoutIndex}
            setWasSelected={setWasSelected}
            wasSelected={wasSelected}
            selectedCardsIndex={props.selectedCardsIndex}
            setSelectedCardsIndex={props.setSelectedCardsIndex}
            userID={userID}
          />

          <Tour
            steps={steps}
            isOpen={isTourOpen}
            onRequestClose={() => setIsTourOpen(false)}
            lastStepNextButton={<a className="lets-begin-link">Lets begin!</a>}
            accentColor={"#007bff"}
            nextButton={<ArrowRightOutlined />}
            prevButton={<ArrowLeftOutlined />}
            rounded={10}
          />

          {/* Grid layout begins here */}
          <GridLayout
            className="layout"
            layouts={layout}
            breakpoints={{ lg: 1200, s: 300 }}
            onLayoutChange={handleLayoutChange}
            draggableHandle={".ant-card-head"}
            cols={{ lg: 12, s: 1 }}
            rowHeight={575}
            width={1200}
          >
            {/*
              For reference, if we console.log(props.selectedCardsIndex), at first an empty array is returned. However if we 
              were to select a card that has an id value of 9 {id: 9}, then Array [9] would be logged. If we were to then 
              select a card with an id of 10 {id: 10}, it would return Array [9, 10]. 
            */}
            {props.selectedCardsIndex.map((cardId, index) => {
              const card = props.availableCards.find((c) => c.id === cardId);

              const defaultDataGrid = {
                x: card.x,
                y: card.y,
                w: card.w,
                h: card.h,
                minW: card.minW,
                isResizable: card.isResizable,
              };

              const extra = (
                <div>
                  <Popover
                    content={card.info}
                    title={card.title}
                    trigger="click"
                    visible={card.infoVisible}
                  >
                    <span className="span-margin">
                      <InfoCircleOutlined
                        className="blue-button"
                        onClick={() =>
                          props.setAvailableCards((arr) =>
                            arr.map((item) =>
                              item.id == card.id
                                ? { ...item, infoVisible: !item.infoVisible }
                                : item
                            )
                          )
                        }
                      />
                    </span>{" "}
                  </Popover>

                  <span onClick={() => removeCardFromLayout(card.id)}>
                    <CloseCircleOutlined />
                  </span>
                </div>
              );

              if (card.name in availableCardsObject) {
                const CustomTag = availableCardsObject[card.name];
                return (
                  <div key={card.id} data-grid={defaultDataGrid}>
                    <CustomTag
                      {...card}
                      extra={extra}
                      darkMode={darkMode}
                      activeTicker={props.activeTicker}
                    />
                  </div>
                );
              }
            })}
          </GridLayout>

          {/* Only renders when the user deletes a card from the page (for 5 seconds) */}
          {wasRemoved && (
            <UndoPrompt
              selectedCardsIndex={props.selectedCardsIndex}
              setSelectedCardsIndex={props.setSelectedCardsIndex}
              availableCards={props.availableCards}
              setWasRemoved={setWasRemoved}
              setUndoClicked={setUndoClicked}
              removedCardId={removedCard}
            />
          )}
        </div>
      );
    } else {
      loginWithRedirect();
    }
  }
};

export default HomeDashboard;
