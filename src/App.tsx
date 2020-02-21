import React from 'react';
import { ToastProvider } from 'react-toast-notifications'
import Api from "./Api";
import Router from "./Router";

const App = () => {
  return (
    <Api>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </Api>
  );
}

export default App;
