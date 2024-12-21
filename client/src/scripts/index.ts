import "../css/style.css";
import { HomeResponse } from "@dataTypes/home.types";

const fetchData = async (url: string): Promise<HomeResponse> => {
  try {
    const dataPromise = await fetch(url, {
      credentials: "include",
    });
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data = await dataPromise.json();
    if (!data) {
      throw new Error("No data found for main page");
    }
    return data;
  } catch (err) {
    console.error(err);
    return {
      title: "Unable to fetch Home Page",
    };
  }
};

const main = async () => {
  const homePageData = await fetchData("http://localhost:3000/");
  const title =
    document.querySelector("#title") ?? document.createElement("h1#title");
  title.textContent = homePageData.title;
  let shopCount = document.querySelector("#shop-count");
  if (!shopCount) {
    shopCount = document.createElement("li#shop-count");
    shopCount.textContent = homePageData.countOfShops?.toString() ?? "";
    document.querySelector("#shop-list")?.appendChild(shopCount);
  }
  shopCount.textContent = homePageData.countOfShops?.toString() ?? "";
  let productCount = document.querySelector("#product-count");
  if (!productCount) {
    productCount = document.createElement("li#product-count");
    productCount.textContent = homePageData.countOfProducts?.toString() ?? "";
    document.querySelector("#product-list")?.appendChild(productCount);
  }
  productCount.textContent = homePageData.countOfProducts?.toString() ?? "";
  let purchaseCount = document.querySelector("#purchase-count");
  if (!purchaseCount) {
    purchaseCount = document.createElement("li#purchase-count");
    purchaseCount.textContent = homePageData.countOfPurchases?.toString() ?? "";
    document.querySelector("#purchase-count")?.appendChild(purchaseCount);
  }
  purchaseCount.textContent = homePageData.countOfPurchases?.toString() ?? "";
};

main();
