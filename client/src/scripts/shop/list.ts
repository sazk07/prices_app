import "@/css/style.css";
import { fetchData } from "@/scripts/utils/fetchData";
import { createNav } from "@/scripts/utils/nav";
import { ShopOutput } from "@dataTypes/shop.types";

const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);
const shopListData: ShopOutput[] = await fetchData(
  "http://localhost:3000/shops",
);
const shopListDataLen = shopListData.length;
let idx = shopListDataLen;
while (idx > 0) {
  const shop = shopListData[shopListDataLen - idx] as ShopOutput;
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = `../../../pages/shop/detail.html?shopId=${shop.shopId}`;
  a.textContent = shop.shopName;
  const p = document.createElement("p");
  // insert anchor and shop.shopLocation to p
  p.appendChild(a);
  const span = document.createElement("span");
  span.textContent = `, ${shop.shopLocation}`;
  p.appendChild(span);
  li.appendChild(p);
  document.querySelector("ul")?.appendChild(li);
  --idx;
}
