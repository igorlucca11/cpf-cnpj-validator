import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Validator from "./pages/Validator";

const App = () => {
  return (
    <div className="page bg-indigo-lt min-vh-100">
      <Header />
      <Validator />
      <Footer />
    </div>
  );
};

export default App;
