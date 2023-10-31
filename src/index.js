import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import ClerkRoutes from "./clerkRoutes";

ReactDOM.render(
  <React.StrictMode>
    {/* pk_test_c2hhcmluZy1ha2l0YS0xOC5jbGVyay5hY2NvdW50cy5kZXYk */}
    <App />
    {/* <ClerkRoutes /> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
