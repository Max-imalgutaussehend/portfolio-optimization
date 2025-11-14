from fastapi import FastAPI
from src.api.routes import router

app = FastAPI(title="QuantPortfolio API")
app.include_router(router)

@app.get("/")
def root():
    return {"message": "QuantPortfolio API is running"}
