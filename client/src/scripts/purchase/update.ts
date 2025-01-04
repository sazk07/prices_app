import "@/css/style.css";
import { PurchaseView } from "@dataTypes/purchase.types";
import { getData } from "../utils/fetchData";
import { createNav } from "../utils/nav";

const purchaseId = new URLSearchParams(window.location.search).get(
  "purchaseId",
);
const purchaseData: PurchaseView = await getData(
  `http://localhost:3000/purchase/${purchaseId}`,
);

const nav = createNav();
document.querySelector("body")?.insertAdjacentElement("afterbegin", nav);

