const shopId = new URLSearchParams(window.location.search).get("shopId");
const deleteBtn = document.querySelector("#deleteShop") as HTMLButtonElement;
deleteBtn.addEventListener("click", async () => {
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
      alert("Failed to delete shop. Please try again.");
      return;
    }
    alert("Shop deleted successfully");
    window.location.href = "../../../pages/shop/list.html";
  } catch (err) {
    console.error("Network Error:", err);
    alert("A network error occurred. Please try again");
  }
});
