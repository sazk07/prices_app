import { Column, SortState } from "@dataTypes/generics.types";

export const createTableHeaders = <T>(keysList: T[], headerNames: string[]) => {
  const thList = keysList.map((key, idx) => {
    const header = document.createElement("th");
    header.setAttribute("data-column", key as string);
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

const sortData = <T>(
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
