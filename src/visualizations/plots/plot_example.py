import matplotlib.pyplot as plt

def plot_example():
    assets = ["Core", "Satellite"]
    weights = [0.7, 0.3]
    plt.pie(weights, labels=assets, autopct="%1.1f%%")
    plt.title("Portfolio Allocation")
    plt.show()

plot_example()