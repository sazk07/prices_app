import "@/css/headerStyle.css";
import { Column } from "@dataTypes/generics.types";

const NOT_ALLOWED = ["shopId", "productId", "purchaseId"];
export const filterKeys = (keysArr: string[]) => {
  return keysArr.filter((key) => !NOT_ALLOWED.includes(key));
};

export const createTableHeaders = (
  keysList: string[],
  headerNames: string[],
) => {
  const thList = keysList.map((key, idx) => {
    const header = document.createElement("th");
    header.setAttribute("data-column", key);
    header.textContent = headerNames[idx] ?? "";
    return header;
  });
  return thList;
};

export const createTableBody = <T>(
  dataList: T[],
  tableBody: HTMLTableSectionElement,
  columns: (keyof T)[],
  linkColumn?: Column<T>,
) => {
  tableBody.textContent = "";
  const { name, baseUrl } = linkColumn ?? {};
  dataList.forEach((data) => {
    const tr = document.createElement("tr");
    columns.forEach((column) => {
      const td = document.createElement("td");
      if (linkColumn && column === name) {
        const link = document.createElement("a");
        link.href = `${baseUrl}${data[linkColumn.id]}`;
        link.textContent = String(data[column]);
        td.appendChild(link);
      } else {
        td.textContent = String(data[column]);
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
};

export const sortData = <T>(
  dataList: T[],
  col: keyof T,
  direction: "asc" | "desc",
) => {
  const sortedData = [...dataList].sort((a, b) => {
    const aVal = String(a[col]).toLowerCase() ?? "";
    const bVal = String(b[col]).toLowerCase() ?? "";
    if (aVal < bVal) {
      return direction === "asc" ? -1 : 1;
    }
    if (aVal > bVal) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });
  return sortedData;
};

export const sortHeaders = <T>(
  header: HTMLTableCellElement,
  headers: NodeListOf<HTMLTableCellElement>,
  column: keyof T | null,
  direction: "asc" | "desc",
  dataList: T[],
  tableBody: HTMLTableSectionElement,
  columns: (keyof T)[],
  linkColumn: Column<T>,
) => {
  const col = header.getAttribute("data-column") as keyof T;
  console.log(col)
  const isSameCol = col === column;
  direction = isSameCol && direction === "asc" ? "desc" : "asc";
  column = col;
  const sortedData = sortData(dataList, col, direction);
  headers.forEach((h) => {
    h.classList.remove("sort-asc", "sort-desc");
  });
  header.classList.add(direction === "asc" ? "sort-asc" : "sort-desc");
  createTableBody(sortedData, tableBody, columns, linkColumn);
};
