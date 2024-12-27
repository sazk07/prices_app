import "@/css/style.css";

const form = document.querySelector("form");
const shopName = form?.elements.namedItem("shopName") as HTMLInputElement;
const shopNameVal = shopName.value;
const shopLocation = form?.elements.namedItem("shopLocation") as HTMLInputElement;
const shopLocationVal = shopLocation.value;
const data = {
  shopName: shopNameVal,
  shopLocation: shopLocationVal,
};
const button = document.querySelector("button");

button?.addEventListener("submit", async () => {
  await fetch("http://localhost:3000/shop/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  window.location.href = "/pages/shop/list.html";
});
