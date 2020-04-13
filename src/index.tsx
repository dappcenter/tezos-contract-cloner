import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ErrorBoundary from "../src/components/ErrorBoundary/index";

ReactDOM.render(
  <ErrorBoundary fallback={<div>Error times!</div>}>
    <App />
  </ErrorBoundary>,
  document.getElementById("root")
);
