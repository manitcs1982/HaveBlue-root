import createTheme from "@material-ui/core/styles/createTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import React from "react";

declare module "@material-ui/core/styles/createTheme" {
  interface Theme {
    btnNew: {
      backgroundColor: React.CSSProperties["backgroundColor"];
      color: React.CSSProperties["color"];
      margin: React.CSSProperties["margin"];
    };
    btnWarning: {
      backgroundColor: React.CSSProperties["backgroundColor"];
      color: React.CSSProperties["color"];
      margin: React.CSSProperties["margin"];
    };
    btnError: {
      backgroundColor: React.CSSProperties["backgroundColor"];
      color: React.CSSProperties["color"];
      margin: React.CSSProperties["margin"];
    };
    btnAssign: {
      backgroundColor: React.CSSProperties["backgroundColor"];
      color: React.CSSProperties["color"];
      margin: React.CSSProperties["margin"];
    };
    container: {
      marginTop: React.CSSProperties["marginTop"];
      marginBottom: React.CSSProperties["marginBottom"];
    };
    containerMargin: {
      margin: React.CSSProperties["margin"];
    };
    containerPadding: {
      margin: React.CSSProperties["padding"];
    };
    tableContainer: {
      maxHeight: React.CSSProperties["maxHeight"];
    };
    dashboardProjectCard: {
      backgroundColor: React.CSSProperties["backgroundColor"];
    };
    dashboardCard: {
      background: React.CSSProperties["background"];
      borderRadius: React.CSSProperties["borderRadius"];
      boxShadow: React.CSSProperties["boxShadow"];
      /*  width: React.CSSProperties["width"];
      height: React.CSSProperties["height"]; */
    };
    dashboardCardTitle: {
      color: React.CSSProperties["color"];
      fontWeight: React.CSSProperties["fontWeight"];
    };
    boldText: {
      fontWeight: React.CSSProperties["fontWeight"];
    };
    monospacedText: {
      fontFamily: React.CSSProperties["fontFamily"];
    };
    cardAnimation: {
      pointerEvents: React.CSSProperties["pointerEvents"];
      borderRadius: React.CSSProperties["borderRadius"];
      background: React.CSSProperties["background"];
      paddingTop: React.CSSProperties["paddingTop"];
      paddingLeft: React.CSSProperties["paddingLeft"];
      top: React.CSSProperties["top"];
      left: React.CSSProperties["left"];
      right: React.CSSProperties["right"];
      position: React.CSSProperties["position"];
      zIndex: React.CSSProperties["zIndex"];
      width: React.CSSProperties["width"];
      height: React.CSSProperties["height"];
    };
    btnSubmit: {
      backgroundColor: React.CSSProperties["backgroundColor"];
    };
    btnClear: {
      backgroundColor: React.CSSProperties["backgroundColor"];
    };
    cardGoToDetailButton: { color: React.CSSProperties["color"] };
    cardHeader: { paddingBottom: React.CSSProperties["paddingBottom"] };
    noLeftRightPadding: {
      paddingLeft: React.CSSProperties["paddingLeft"];
      paddingRight: React.CSSProperties["paddingRight"];
    };
  }
  interface ThemeOptions {
    btnNew: {
      backgroundColor: React.CSSProperties["backgroundColor"];
      color: React.CSSProperties["color"];
      margin: React.CSSProperties["margin"];
    };
    btnWarning: {
      backgroundColor: React.CSSProperties["backgroundColor"];
      color: React.CSSProperties["color"];
      margin: React.CSSProperties["margin"];
    };
    btnError: {
      backgroundColor: React.CSSProperties["backgroundColor"];
      color: React.CSSProperties["color"];
      margin: React.CSSProperties["margin"];
    };
    btnAssign: {
      backgroundColor: React.CSSProperties["backgroundColor"];
      color: React.CSSProperties["color"];
      margin: React.CSSProperties["margin"];
    };
    container: {
      marginTop: React.CSSProperties["marginTop"];
      marginBottom: React.CSSProperties["marginBottom"];
    };
    containerPadding: {
      padding: React.CSSProperties["padding"];
    };
    containerMargin: {
      margin: React.CSSProperties["margin"];
    };
    tableContainer: {
      maxHeight: React.CSSProperties["maxHeight"];
    };
    dashboardCard: {
      background: React.CSSProperties["background"];
      borderRadius: React.CSSProperties["borderRadius"];
      boxShadow: React.CSSProperties["boxShadow"];
      /*  width: React.CSSProperties["width"];
      height: React.CSSProperties["height"]; */
    };
    dashboardProjectCard: {
      backgroundColor: React.CSSProperties["backgroundColor"];
    };
    dashboardCardTitle: {
      color: React.CSSProperties["color"];
      fontWeight: React.CSSProperties["fontWeight"];
    };
    boldText: {
      fontWeight: React.CSSProperties["fontWeight"];
    };
    monospacedText: {
      fontFamily: React.CSSProperties["fontFamily"];
    };
    cardAnimation: {
      pointerEvents: React.CSSProperties["pointerEvents"];
      borderRadius: React.CSSProperties["borderRadius"];
      background: React.CSSProperties["background"];
      paddingTop: React.CSSProperties["paddingTop"];
      top: React.CSSProperties["top"];
      left: React.CSSProperties["left"];
      right: React.CSSProperties["right"];
      position: React.CSSProperties["position"];
      zIndex: React.CSSProperties["zIndex"];
      width: React.CSSProperties["width"];
      height: React.CSSProperties["height"];
      paddingLeft: React.CSSProperties["paddingLeft"];
    };
    btnSubmit: {
      backgroundColor: React.CSSProperties["backgroundColor"];
    };
    btnClear: {
      backgroundColor: React.CSSProperties["backgroundColor"];
    };
    cardGoToDetailButton: { color: React.CSSProperties["color"] };
    cardHeader: { paddingBottom: React.CSSProperties["paddingBottom"] };
    noLeftRightPadding: {
      paddingLeft: React.CSSProperties["paddingLeft"];
      paddingRight: React.CSSProperties["paddingRight"];
    };
  }
}

const theme = createTheme({
  btnNew: {
    backgroundColor: "#64dd17",
    color: "black",
    margin: "20px",
  },
  btnClear: {
    backgroundColor: "#e65b69",
  },
  btnWarning: {
    backgroundColor: "#FFC107",
    color: "black",
    margin: "20px",
  },
  btnError: {
    backgroundColor: "#DC3545",
    color: "black",
    margin: "20px",
  },
  btnAssign: {
    backgroundColor: "#ADD8E6",
    color: "black",
    margin: "20px",
  },
  container: {
    marginTop: "30px",
    marginBottom: "30px",
  },
  containerPadding: {
    padding: "30px",
  },
  containerMargin: {
    margin: "30px",
  },
  tableContainer: {
    maxHeight: "70vh",
  },
  dashboardProjectCard: {
    backgroundColor: "#ee8100",
  },
  dashboardCardTitle: {
    color: "black",
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
  },
  cardAnimation: {
    pointerEvents: "auto",
    borderRadius: "20px",
    background: "white",
    paddingTop: "50px",
    paddingLeft: "50px",
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
    width: "inherit",
    height: "200vh",
  },
  btnSubmit: {
    backgroundColor: "#64dd17",
  },
  dashboardCard: {
    background: "white",
    borderRadius: 30,
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
  },
  cardGoToDetailButton: {
    color: "black",
  },
  cardHeader: { paddingBottom: 0 },
  monospacedText: {
    fontFamily: "monospace",
  },
  noLeftRightPadding: {
    paddingRight: 0,
    paddingLeft: 0,
  },
});

export const LSDBTheme = responsiveFontSizes(theme);
