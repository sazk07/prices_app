import "../css/style.css";
import { HomeResponse } from "@dataTypes/home.types";

const fetchData = async (url: string): Promise<HomeResponse> => {
  try {
    const dataPromise = await fetch(url, {
      credentials: "include",
    });
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data = await dataPromise.json();
    if (!data) {
      throw new Error("No data found for main page");
    }
    return data;
  } catch (err) {
    console.error(err);
    return {
      title: "Unable to fetch Home Page",
    };
  }
};

const main = async () => {
  const homePageData = await fetchData("http://localhost:3000/");
  const title =
    document.querySelector("#title") ?? document.createElement("h1#title");
  title.textContent = homePageData.title;
};

main();
