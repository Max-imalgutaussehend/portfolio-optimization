from fastapi import FastAPI
from src.api.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="QuantPortfolio API")
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # später sicherer machen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "QuantPortfolio API is running"}
