import "@/css/style.css";
import { getData } from "@/scripts/utils/fetchData";
import { createNav } from "@/scripts/utils/nav";
import { ShopOutput } from "@dataTypes/shop.types";

const nav = createNav();
document.querySelector("a")?.insertAdjacentElement("afterend", nav);

const ul = document.createElement("ul");
ul.setAttribute("id", "shopList");
document.querySelector("nav")?.insertAdjacentElement("afterend", ul);

const shopListData: ShopOutput[] = await getData("http://localhost:3000/shops");
const shopListDataLen = shopListData.length;
let idx = shopListDataLen;
while (idx > 0) {
  const shop = shopListData[shopListDataLen - idx] as ShopOutput;
  const a = document.createElement("a");
  a.href = `../../../shop/detail.html?shopId=${shop.shopId}`;
  a.textContent = shop.shopName;
  const span = document.createElement("span");
  span.textContent = `, ${shop.shopLocation}`;
  const p = document.createElement("p");
  p.appendChild(a);
  p.appendChild(span);
  const li = document.createElement("li");
  li.appendChild(p);
  document.querySelector("#shopList")?.appendChild(li);
  --idx;
}
