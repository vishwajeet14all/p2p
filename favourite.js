const shimmerContainer = document.querySelector(".shimmer-container");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-irhs12bFULcXfsensqPHFhhx",
  },
};

const getFavouriteCoin = () => {
  return JSON.parse(localStorage.getItem("favourites")) || [];
};

//fetch an api
const fetchFavouritesCoins = async (coinIds) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(
        ","
      )}`,
      options
    );
    const coinsData = await response.json();
    return coinsData;
  } catch (error) {
    console.log(error);
  }
};

const showShimmer = () => {
  shimmerContainer.style.display = "flex";
};

const hideShimmer = () => {
  shimmerContainer.style.display = "none";
};

//display data
const displayFavoriteCoins = (favCoins) => {
  const tableBody = document.getElementById("favourite-table-body");
  tableBody.innerHTML = "";
  favCoins.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
            <td><img src="${coin.image}" alt="${
      coin.name
    }" width="24" height="24" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>${coin.total_volume.toLocaleString()}</td>
            <td>${coin.market_cap}</td>
        `;
    tableBody.appendChild(row);

    row.addEventListener("click", () => {
      window.open(`coin.html?id=${coin.id}`, "_blank");
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showShimmer();
    const favourites = getFavouriteCoin();

    if (favourites.length > 0) {
      const favoritesCoins = await fetchFavouritesCoins(favourites);
      displayFavoriteCoins(favoritesCoins);
    } else {
      const noFavMsg = document.getElementById("no-favorites");
      noFavMsg.style.display = "block";
    }
    hideShimmer();
  } catch (error) {
    hideShimmer();
  }
});
