import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import Home from './components/Home';
import CreateSafe from './components/CreateSafe';
import Information from './components/Information';
import Approve from './components/Approve';
import Req from './components/Req';
import ConnectSafe  from './components/ConnectSafe';

import "./scss/index.scss";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="/createSafe" element={<CreateSafe />}/>
        <Route path="/connectSafe" element={<ConnectSafe />}/>
        <Route path="/request" element={<Req />}/>
        <Route path="/approve" element={<Approve />}/>
        <Route path="/information" element={<Information />}/>
      </Route>
    </Routes>
  </Router>,
  document.getElementById("root")
);
