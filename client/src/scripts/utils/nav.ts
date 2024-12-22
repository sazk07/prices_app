import "../../css/style.css";

// create a function that creates a nav element
export const createNav = () => {
  // create a list of links
  const links = [
    { href: "http://localhost:5173/pages/shop/list.html", text: "All Shops" },
    {
      href: "http://localhost:5173/pages/product/list.html",
      text: "All Products",
    },
    {
      href: "http://localhost:5173/pages/purchase/list.html",
      text: "All Purchases",
    },
    {
      href: "http://localhost:5173/pages/shop/create.html",
      text: "Create New Shop",
    },
    {
      href: "http://localhost:5173/pages/product/create.html",
      text: "Create New Product",
    },
    {
      href: "http://localhost:5173/pages/purchase/create.html",
      text: "Create New Purchase",
    },
  ];

  // create a nav element
  const nav = document.createElement("nav");

  // create a ul element
  const ul = document.createElement("ul");

  // create a li element for each link
  const linksLength = links.length;
  const halfway = Math.floor(linksLength / 2);
  let idx = 0;
  while (idx < linksLength) {
    const link = links[idx] as { href: string; text: string };
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link?.href;
    a.textContent = link?.text;
    li.appendChild(a);
    ul.appendChild(li);
    if (idx === halfway - 1) {
      const hr = document.createElement("hr");
      ul.appendChild(hr);
    }
    idx++;
  }

  // add the ul element to the nav element
  nav.appendChild(ul);
  return nav;
};
