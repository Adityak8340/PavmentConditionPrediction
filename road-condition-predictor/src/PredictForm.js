// src/PredictForm.js
import React, { useState } from 'react';
import './PredictForm.css';

const PredictForm = () => {
  const [formData, setFormData] = useState({
    brand_opel: '0',
    brand_peugeot: '0',
    VehicleSpeedAverage: '',
    IntakeAirTemperature: '',
    FuelConsumptionAverage: '',
    MassAirFlow: '',
    EngineCoolantTemperature: '',
    VehicleSpeedVariance: '',
    VerticalAcceleration: '',
    traffic_NormalCongestionCondition: '0',
    LongitudinalAcceleration: '',
    VehicleSpeedInstantaneous: '',
    traffic_LowCongestionCondition: '0',
    EngineRPM: '',
    ManifoldAbsolutePressure: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBrandSelect = (brand) => {
    setFormData({
      ...formData,
      brand_opel: brand === 'opel' ? '1' : '0',
      brand_peugeot: brand === 'peugeot' ? '1' : '0'
    });
  };

  const handleTrafficSelect = (traffic) => {
    setFormData({
      ...formData,
      traffic_NormalCongestionCondition: traffic === 'normal' ? '1' : '0',
      traffic_LowCongestionCondition: traffic === 'low' ? '1' : '0'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        // Change URL to the actual API endpoint
        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            // Add CORS headers if needed
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Prediction failed');
        
        const data = await response.json();
        setPrediction(data.road_condition);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
  };

  const getRoadConditionText = (prediction) => {
    switch(prediction) {
      case 0: return 'Full of Holes';
      case 1: return 'Smooth';
      case 2: return 'Uneven';
      default: return 'Unknown';
    }
  };

  return (
    <div className="predict-form-container">
      <form onSubmit={handleSubmit} className="predict-form">
        <div className="form-section">
          <h3>Vehicle Selection</h3>
          <div className="brand-selector">
            <button
              type="button"
              className={`brand-button ${formData.brand_opel === '1' ? 'active' : ''}`}
              onClick={() => handleBrandSelect('opel')}
            >
              Opel
            </button>
            <button
              type="button"
              className={`brand-button ${formData.brand_peugeot === '1' ? 'active' : ''}`}
              onClick={() => handleBrandSelect('peugeot')}
            >
              Peugeot
            </button>
          </div>
        </div>

        <div className="form-section">
          <h3>Traffic Conditions</h3>
          <div className="traffic-selector">
            <button
              type="button"
              className={`traffic-button ${formData.traffic_LowCongestionCondition === '1' ? 'active' : ''}`}
              onClick={() => handleTrafficSelect('low')}
            >
              Low Traffic
            </button>
            <button
              type="button"
              className={`traffic-button ${formData.traffic_NormalCongestionCondition === '1' ? 'active' : ''}`}
              onClick={() => handleTrafficSelect('normal')}
            >
              Normal Traffic
            </button>
          </div>
        </div>

        <div className="form-section">
          <h3>Vehicle Data</h3>
          <div className="form-grid">
            {Object.keys(formData).map((key) => {
              if (!['brand_opel', 'brand_peugeot', 'traffic_NormalCongestionCondition', 'traffic_LowCongestionCondition'].includes(key)) {
                return (
                  <div key={key} className="form-field">
                    <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <button type="submit" className="predict-button" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Road Condition'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {prediction !== null && !error && (
        <div className={`prediction-result condition-${prediction}`}>
          <h2>Predicted Road Condition:</h2>
          <div className="condition-indicator">
            <div className="condition-icon"></div>
            <p>{getRoadConditionText(prediction)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictForm;