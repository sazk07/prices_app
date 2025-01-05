import "../../css/style.css";
import { ProductOutput } from "@dataTypes/product.types";
import { getData } from "../utils/fetchData";
import { ShopOutput } from "@dataTypes/shop.types";

const productList: ProductOutput[] = await getData(
  "http://localhost:3000/products",
);
const productOptions = document.querySelector(
  "#productId",
) as HTMLSelectElement;
for (const product of productList) {
  const option = document.createElement("option");
  option.value = `${product.productId}`;
  option.textContent = `
    ${product.productId},
    ${product.productName},
    ${product.productBrand},
    ${product.productCategory}
  `;
  productOptions.appendChild(option);
}

const shopList: ShopOutput[] = await getData("http://localhost:3000/shops");
const shopOptions = document.querySelector("#shopId") as HTMLSelectElement;
for (const shop of shopList) {
  const option = document.createElement("option");
  option.value = `${shop.shopId}`;
  option.textContent = `
    ${shop.shopId},
    ${shop.shopName},
    ${shop.shopLocation}
  `;
  shopOptions.appendChild(option);
}

const form = document.querySelector("form") as HTMLFormElement;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const data = {
    purchaseDate: form["purchaseDate"].value.trim(),
    productId: form["productId"].value.trim(),
    shopId: form["shopId"].value.trim(),
    quantity: form["quantity"].value.trim(),
    price: form["price"].value.trim(),
    taxRate: form["taxRate"].value.trim(),
    taxAmount: form["taxAmount"].value.trim(),
    mrpTaxAmount: form["mrpTaxAmount"].value.trim(),
    nonMrpTaxAmount: form["nonMrpTaxAmount"].value.trim(),
  };
  try {
    const response = await fetch("http://localhost:3000/purchase/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      alert("Failed to add purchase. Please try again.");
      return;
    }
    const respData = await response.json();
    const message = document.querySelector("#message") as HTMLDivElement;
    message.textContent = respData.message;
  } catch (err) {
    console.error("Network Error:", err);
    alert("A network error occurred. Please try again");
  }
});
