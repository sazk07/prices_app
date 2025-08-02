import "@/css/style.css";
import { type ShopOutput } from "@dataTypes/shop.types";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";

const shopId = new URLSearchParams(window.location.search).get("shopId");
const shopData: ShopOutput = await getData(
  `http://localhost:3000/shop/${shopId}`,
);

const nav = createNav();
document.querySelector("body")?.insertAdjacentElement("afterbegin", nav);

const shopNameInput = document.querySelector("#shopName") as HTMLInputElement;
shopNameInput.value = shopData.shopName;

const shopLocationInput = document.querySelector(
  "#shopLocation",
) as HTMLInputElement;
shopLocationInput.value = shopData.shopLocation;

const form = document.querySelector("form") as HTMLFormElement;
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const data = {
    shopName: form["shopName"].value.trim(),
    shopLocation: form["shopLocation"].value.trim(),
  };
  try {
    const response = await fetch(
      `http://localhost:3000/shop/${shopId}/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      alert("Failed to update shop. Please try again.");
      return;
    }
    if (response.status === 204) {
      const message = document.querySelector("#message") as HTMLDivElement;
      message.textContent = "Shop updated successfully";
    }
  } catch (err) {
    console.error("Network Error:", err);
    alert("A network error occurred. Please try again");
  }
});

