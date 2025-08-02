import "@/css/style.css";
import { type ProductOutput } from "@dataTypes/product.types";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";

const productId = new URLSearchParams(window.location.search).get("productId");
const productData: ProductOutput = await getData(
  `http://localhost:3000/product/${productId}`,
);

const nav = createNav();
document.querySelector("body")?.insertAdjacentElement("afterbegin", nav);

const productNameInput = document.querySelector(
  "#productName",
) as HTMLInputElement;
productNameInput.value = productData.productName;

const productBrandInput = document.querySelector(
  "#productBrand",
) as HTMLInputElement;
productBrandInput.value = productData.productBrand;

const productCategoryInput = document.querySelector(
  "#productCategory",
) as HTMLInputElement;
productCategoryInput.value = productData.productCategory;

const form = document.querySelector("form") as HTMLFormElement;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const data = {
    productName: form["productName"].value.trim(),
    productBrand: form["productBrand"].value.trim(),
    productCategory: form["productCategory"].value.trim(),
  };
  try {
    const response = await fetch(
      `http://localhost:3000/product/${productId}/update`,
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
      alert("Failed to update product. Please try again.");
      return;
    }
    if (response.status === 204) {
      const message = document.querySelector("#message") as HTMLDivElement;
      message.textContent = "Product updated successfully";
    }
  } catch (err) {
    console.error("Network Error:", err);
    alert("A network error occurred. Please try again");
  }
});
