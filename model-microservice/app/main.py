from app.middleware.auth_middleware import auth_middleware
from fastapi import FastAPI
from pydantic import BaseModel
from app.model.model import predict_pipeline

app = FastAPI()

app.middleware("http")(auth_middleware)

class ImgPathIn(BaseModel):
    path: str

class PredictionOut(BaseModel):
    prediction: float

@app.get("/")
def home():
    return {"health_check": "OK"}

@app.post("/predict", response_model=PredictionOut)
def predict(payload: ImgPathIn):
    prediction = predict_pipeline(payload.path)
    return {"prediction": prediction}