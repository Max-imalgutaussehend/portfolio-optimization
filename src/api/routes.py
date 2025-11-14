from fastapi import APIRouter

router = APIRouter()

@router.get("/portfolio")
def get_portfolio():
    # Platzhalter-Daten
    return {"portfolio": [{"asset": "MSCI World", "weight": 0.5}]}
