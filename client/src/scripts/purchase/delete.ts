const purchaseId = new URLSearchParams(window.location.search).get(
  "purchaseId",
);
const purchaseDeleteBtn = document.querySelector(
  "#deletePurchase",
) as HTMLButtonElement;

purchaseDeleteBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/purchase/${purchaseId}/delete`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      alert("Failed to delete Purchase record. Please try again");
      return;
    }
    alert("Purchase deleted successfully");
  } catch (err) {
    console.error("Network Error:", err);
    alert("A network error occurred. Please try again");
  }
});
