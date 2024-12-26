import { ShopOutput } from "@dataTypes/shop.types";
import "@/css/style.css";
import { fetchData } from "@/scripts/utils/fetchData";
import { createNav } from "@/scripts/utils/nav";

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
let id = document.querySelector("#shopId");
if (!id) {
  id = document.createElement("h1");
  id.setAttribute("id", "shopId");
  document.querySelector("body")?.insertAdjacentElement("afterbegin", id);
}
id.textContent = `ID: ${shopData.shopId}`;
let name = document.querySelector("p")
if (!name) {
  name = document.createElement("p");
  document.querySelector("#shopId")?.insertAdjacentElement("afterend", name);
}
name.textContent = `Shop Name: ${shopData.shopName}`;
let location = document.querySelector("#location");
if (!location) {
  location = document.createElement("p");
  location.setAttribute("id", "location");
  name.insertAdjacentElement("afterend", location);
}
location.textContent = `Location: ${shopData.shopLocation}`;
