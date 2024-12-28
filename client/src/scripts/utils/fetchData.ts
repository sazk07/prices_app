export const getData = async (url: string) => {
  try {
    const dataPromise = await fetch(url, {
      credentials: "include",
    });
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data = await dataPromise.json();
    if (!data) {
      throw new Error("No data found");
    }
    return data;
  } catch (err) {
    console.error(err);
    return {
      title: "Network Error. Please try again.",
    };
  }
};
