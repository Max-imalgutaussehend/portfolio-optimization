from fastapi import APIRouter
import duckdb

router = APIRouter()
DB_PATH = "data/db/portfolio.duckdb"

@router.get("/prices")
def get_prices():
    con = duckdb.connect(DB_PATH)
    df = con.execute("SELECT * FROM prices ORDER BY date").df()
    con.close()
    return df.to_dict(orient="records")
