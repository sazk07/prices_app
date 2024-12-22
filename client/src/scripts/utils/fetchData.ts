export const fetchData = async (url: string) => {
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
