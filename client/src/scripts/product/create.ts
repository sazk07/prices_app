import "@/css/style.css";

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
    const response = await fetch("http://localhost:3000/product/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      alert("Failed to add product. Please try again.");
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
