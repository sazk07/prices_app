import "../css/style.css";

const response = await fetch("http://localhost:3000/", {
  credentials: "include",
});
const homePageData = await response.json();
const title =
  document.querySelector("#title") ?? document.createElement("h1#title");
title.textContent = homePageData.title;
