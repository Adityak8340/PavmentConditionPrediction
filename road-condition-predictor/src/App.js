// src/App.js
import React from 'react';
import PredictForm from './PredictForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="background-animation"></div>
      <div className="content">
        <header className="App-header">
          <h1 className="title" style={{ textAlign: 'center' }}>Road Condition Predictor</h1>
          <p className="subtitle" style={{ textAlign: 'center' }}>Analyze road conditions using vehicle data</p>
        </header>
        <main>
          <PredictForm />
        </main>
      </div>
    </div>
  );
}

export default App;