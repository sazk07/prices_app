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

  const homePageDataKeys = Object.keys(homePageData);
  let idx = 0;
  while (idx < homePageDataKeys.length) {
    const k = homePageDataKeys[idx];
    const li = document.createElement("li");
    switch (k) {
      default:
        break;
      case "countOfShops":
        li.textContent = `Shops: ${homePageData[k]}`;
        break;
      case "countOfProducts":
        li.textContent = `Products: ${homePageData[k]}`;
        break;
      case "countOfPurchases":
        li.textContent = `Purchases: ${homePageData[k]}`;
        break;
    }
    // if li is not empty, append to #record-counts
    li.textContent && document.querySelector("#record-counts")?.appendChild(li);
    idx++;
  }
};

main();
