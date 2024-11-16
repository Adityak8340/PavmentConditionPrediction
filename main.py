from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model = joblib.load('road_condition_model.pkl')

class RoadConditionInput(BaseModel):
    brand_opel: float
    brand_peugeot: float
    VehicleSpeedAverage: float
    IntakeAirTemperature: float
    FuelConsumptionAverage: float
    MassAirFlow: float
    EngineCoolantTemperature: float
    VehicleSpeedVariance: float
    VerticalAcceleration: float
    traffic_NormalCongestionCondition: float
    LongitudinalAcceleration: float
    VehicleSpeedInstantaneous: float
    traffic_LowCongestionCondition: float
    EngineRPM: float
    ManifoldAbsolutePressure: float

@app.post("/predict")
def predict(input: RoadConditionInput):
    data = np.array([[
        input.brand_opel,
        input.brand_peugeot,
        input.VehicleSpeedAverage,
        input.IntakeAirTemperature,
        input.FuelConsumptionAverage,
        input.MassAirFlow,
        input.EngineCoolantTemperature,
        input.VehicleSpeedVariance,
        input.VerticalAcceleration,
        input.traffic_NormalCongestionCondition,
        input.LongitudinalAcceleration,
        input.VehicleSpeedInstantaneous,
        input.traffic_LowCongestionCondition,
        input.EngineRPM,
        input.ManifoldAbsolutePressure
    ]])
    prediction = model.predict(data)
    return {"road_condition": int(prediction[0])}