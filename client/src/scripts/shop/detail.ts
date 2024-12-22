import { ShopOutput } from "@dataTypes/shop.types";
import "../../css/style.css";
import { fetchData } from "../utils/fetchData";
import { createNav } from "../utils/nav";

const nav = createNav();
document.querySelector("body")?.insertAdjacentElement("afterbegin", nav);
// get shopId from query param in browser url
const shopId = new URLSearchParams(window.location.search).get("shopId");
const shopData: ShopOutput = await fetchData(
  `http://localhost:3000/shop/${shopId}`,
);
// insert shopName into title and h1
const title =
  document.querySelector("title") ?? document.createElement("title");
title.textContent = `${shopData.shopName} - Expense Tracker`;
const h1 = document.querySelector("h1") ?? document.createElement("h1");
h1.textContent = shopData.shopName;
const id = document.querySelector("#shopId") ?? document.createElement("p");
id.textContent = `Shop ID: ${shopData.shopId}`;
document.querySelector("h1")?.insertAdjacentElement("afterend", id);
const location =
  document.querySelector("#location") ?? document.createElement("p");
location.textContent = `Location: ${shopData.shopLocation}`;
