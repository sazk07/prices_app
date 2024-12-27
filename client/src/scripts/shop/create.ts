import "@/css/style.css";

const form = document.querySelector("form") as HTMLFormElement;
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const data = {
    shopName: form["shopName"].value.trim(),
    shopLocation: form["shopLocation"].value.trim(),
  };
  try {
    const response = await fetch("http://localhost:3000/shop/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      alert("Failed to add shop. Please try again.");
      return;
    }
    window.location.href = "http://localhost:5173";
  } catch (err) {
    console.error("Network Error:", err);
    alert("A network error occurred. Please try again");
  }
});
