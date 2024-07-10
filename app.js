const shimmerContainer =
  document.getElementsByClassName("shimmer-container")[0];
const paginationContainer = document.getElementById("pagination-container");
const sortPriceInc = document.getElementById("price-inc");
const sortPriceDec = document.getElementById("price-dec");
const searchBox = document.getElementById("search-box");


const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-irhs12bFULcXfsensqPHFhhx",
  },
};

let coins = [];
let itemsPerPage = 15;
let currentPage = 1;

//fetch an api
const fetchCoins = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1",
      options
    );
    const coinsData = await response.json();
    return coinsData;
  } catch (error) {
    console.log(error);
  }
};

//saving in local storage
const saveFavouriteCoins = (favourites) => {
  localStorage.setItem("favourites", JSON.stringify(favourites));
};

//getting data from local storage
const fetchFavouriteCoins = () => {
  return JSON.parse(localStorage.getItem("favourites")) || [];
};

//getting and setting values in local storage
const handleFavClick = (coinId) => {
  const favourites = fetchFavouriteCoins();
  if (!favourites.includes(coinId)) {
    favourites.push(coinId);
    saveFavouriteCoins(favourites);
  }
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
};

sortCoinsByPrice = (order) => {
  if (order === "asc") {
    coins.sort((a, b) => a.current_price - b.current_price);
  }else if(order === "desc"){
    coins.sort((a, b) => b.current_price - a.current_price);
  }
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
};

sortPriceInc.addEventListener("click", () => {
  sortCoinsByPrice("asc");
});

sortPriceDec.addEventListener("click", () => {
  sortCoinsByPrice("desc");
});

const handleSearch = () => {
  const searchQuery = searchBox.value.trim();
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  currentPage = 1;
  displayCoins(getCoinsToDisplay(filteredCoins, currentPage), currentPage);
  renderPagination(filteredCoins);
}

//Search Functionality
searchBox.addEventListener("input", handleSearch)

const removeFavouriteCoin = (coinId) => {
  const favourites = fetchFavouriteCoins();
  const updatedFavourites = favourites.filter((fav) => fav !== coinId);
  saveFavouriteCoins(updatedFavourites);
};

const showShimmer = () => {
  shimmerContainer.style.display = "flex";
};

const hideShimmer = () => {
  shimmerContainer.style.display = "none";
};

const getCoinsToDisplay = (coins, page) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return coins.slice(start, end);
};

//display data
const displayCoins = (coins, currentPage) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  //star marked favourite class adding
  const favourites = fetchFavouriteCoins();

  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = "";
  coins.forEach((coin, index) => {
    const row = document.createElement("tr");
    const isFavourite = favourites.includes(coin.id);
    row.classList.add(isFavourite);
    row.innerHTML = `
            <td>${start + index}</td>
            <td><img src="${coin.image}" alt="${
      coin.name
    }" width="24" height="24" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>${coin.total_volume.toLocaleString()}</td>
            <td>${coin.market_cap}</td>
            <td><i class="fa-solid fa-star favourite-icon ${
              isFavourite ? "favourite" : ""
            }" data-id="${coin.id}"></i></td>
        `;
    
    row.addEventListener("click", () => {
      window.open(`coin.html?id=${coin.id}`, "_blank");
    })

    row.querySelector(".favourite-icon").addEventListener("click", (e) => {
      e.stopPropagation();
      handleFavClick(coin.id);
    });
    tableBody.appendChild(row);
    
  });
};

const renderPagination = (coins) => {
  const totalPages = Math.ceil(coins.length / itemsPerPage);
  paginationContainer.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-button");
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
      updatePaginationButton();
    });
    paginationContainer.appendChild(pageBtn);
  }
};

const updatePaginationButton = () => {
  const pageBtns = document.querySelectorAll(".page-button");
  pageBtns.forEach((button, index) => {
    if (index + 1 == currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    showShimmer();
    coins = await fetchCoins();
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
    renderPagination(coins);
    hideShimmer();
  } catch (error) {
    hideShimmer();
  }
});
