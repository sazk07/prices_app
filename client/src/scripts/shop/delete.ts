const shopId = new URLSearchParams(window.location.search).get("shopId");
const shopDeleteBtn = document.querySelector(
  "#deleteShop",
) as HTMLButtonElement;
shopDeleteBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/shop/${shopId}/delete`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      alert(
        "WARNING: shop record has associated purchases. Delete them first.",
      );
      return;
    }
    alert("Shop deleted successfully");
    window.location.href = "../../../shops.html";
  } catch (err) {
    console.error("Network Error:", err);
    alert("A network error occurred. Please try again");
  }
});
