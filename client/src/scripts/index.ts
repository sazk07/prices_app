import "@/css/style.css";
import { type HomeResponse } from "@dataTypes/home.types";
import { getData } from "@/scripts/utils/fetchData";
import { createNav } from "@/scripts/utils/nav";

const homePageData: HomeResponse = await getData("http://localhost:3000/");
let title = document.querySelector("#title")
if (!title) {
  title = document.createElement("h1")
  title.setAttribute("id", "title")
}
title.textContent = homePageData.title;
// append nav elem
const nav = createNav();
document.querySelector("#title")?.insertAdjacentElement("afterend", nav);
const homePageDataKeys = Object.keys(homePageData);
const homePageDataKeysLen = homePageDataKeys.length;
let idx = homePageDataKeysLen;
while (idx > 0) {
  const k = homePageDataKeys[homePageDataKeysLen - idx];
  const li = document.createElement("li");
  switch (k) {
    case "countOfShops":
      li.textContent = `Shops: ${homePageData[k]}`;
      break;
    case "countOfProducts":
      li.textContent = `Products: ${homePageData[k]}`;
      break;
    case "countOfPurchases":
      li.textContent = `Purchases: ${homePageData[k]}`;
      break;
    default:
      break;
  }
  // if li is not empty, append to #record-counts
  li.textContent && document.querySelector("#record-counts")?.appendChild(li);
  --idx;
}
