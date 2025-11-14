import duckdb
import matplotlib.pyplot as plt

DB_PATH = "data/db/portfolio.duckdb"

def plot_price():
    con = duckdb.connect(DB_PATH)
    df = con.execute("SELECT * FROM prices ORDER BY date").df()
    con.close()

    plt.plot(df["date"], df["price"])
    plt.xticks(rotation=45)
    plt.title("Asset Price Over Time (Skeleton)")
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    plot_price()
