import React from 'react';
import logo from './logo.svg';
import './App.css';
import AptList from './components/AptList'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="main">
        <AptList />
      </div>
    </div>
  );
}

export default App;
