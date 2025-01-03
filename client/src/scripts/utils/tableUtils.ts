import { Column, SortState } from "@dataTypes/generics.types";

export const createTableHeadersList = <T>(
  keysList: T[],
  headerNames: string[],
) => {
  const thList = keysList.map((key, idx) => {
    const header = document.createElement("th");
    const kStr = String(key);
    header.setAttribute("data-column", kStr);
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
      const colStr = String(column);
      td.setAttribute("data-column", colStr);
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

export const rearrangeKeys = <T>(keys: (keyof T)[], desiredOrder: string[]) => {
  return desiredOrder
    .map((elem) => keys.find((key) => key === elem))
    .filter((key) => key !== undefined);
};

const sortData = <T>(
  dataList: T[],
  col: keyof T,
  direction: "asc" | "desc",
) => {
  const sortedData = [...dataList].sort((a, b) => {
    const aVal = a[col];
    const bVal = b[col];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) {
      return direction === "asc" ? -1 : 1;
    }
    if (aStr > bStr) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });
  return sortedData;
};

export const sortTable = <T>(
  dataList: T[],
  tableBody: HTMLTableSectionElement,
  columns: (keyof T)[],
  linkColumn: Column<T>,
  header: HTMLTableCellElement,
  headers: NodeListOf<HTMLTableCellElement>,
  currSortState: SortState<T>,
) => {
  const col = header.getAttribute("data-column") as keyof T;
  const isSameCol = col === currSortState.column;
  currSortState.direction =
    isSameCol && currSortState.direction === "asc" ? "desc" : "asc";
  currSortState.column = col;
  const sortedData = sortData(dataList, col, currSortState.direction);
  headers.forEach((h) => h.removeAttribute("class"));
  header.setAttribute(
    "class",
    currSortState.direction === "asc" ? "sort-asc" : "sort-desc",
  );
  createTableBody(sortedData, tableBody, columns, linkColumn);
};

export const createTableWithId = (id: string) => {
  const tbody = document.createElement("tbody");
  tbody.setAttribute("id", id);
  return tbody;
};
