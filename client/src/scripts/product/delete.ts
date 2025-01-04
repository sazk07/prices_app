const productId = new URLSearchParams(window.location.search).get("productId");
const productDeleteBtn = document.querySelector(
  "#deleteProduct",
) as HTMLButtonElement;
productDeleteBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/product/${productId}/delete`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      const error = await response.json();
      console.error("Error:", error);
      alert(
        "WARNING: product record has associated purchases. Delete them first.",
      );
      return;
    }
    alert("Product deleted successfully");
    window.location.href = "../../products.html";
  } catch (err) {
    console.error("Network Error:", err);
    alert("A network error occurred. Please try again");
  }
});
