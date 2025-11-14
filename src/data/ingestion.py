import duckdb
import pandas as pd
from datetime import datetime
import yfinance as yf  # Optional, du kannst Dummy-Daten verwenden

DB_PATH = "data/db/portfolio.duckdb"

def fetch_data():
    # Dummy: MSCI World ETF (oder benutze eigene Symbol)
    df = yf.download("URTH", period="1mo", interval="1d")

    df = df.reset_index()
    df["date"] = df["Date"].astype(str)
    df = df[["date", "Close"]].rename(columns={"Close": "price"})

    return df

def save_to_db(df: pd.DataFrame):
    con = duckdb.connect(DB_PATH)
    con.execute("""
        CREATE TABLE IF NOT EXISTS prices (
            date VARCHAR,
            price DOUBLE
        );
    """)
    con.execute("DELETE FROM prices")  # Skeleton: überschreibt
    con.execute("INSERT INTO prices SELECT * FROM df")
    con.close()

def run_ingestion():
    df = fetch_data()
    save_to_db(df)
    print("Data ingestion completed at", datetime.now())

if __name__ == "__main__":
    run_ingestion()
