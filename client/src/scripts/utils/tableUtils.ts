import "@/css/headerStyle.css";

const filterKeys = (keysArr: string[]) => {
  const notId = (item: string) => {
    const notAllowed = ["shopId", "productId", "purchaseId"];
    return notAllowed.includes(item) ? false : true;
  };
  return keysArr.filter(notId);
};

export const createTableHeaders = (keysArr: string[], namesArr: string[]) => {
  const filteredKeys = filterKeys(keysArr);
  const headerCount = filteredKeys.length;

  const thList = [];

  let idx = headerCount;
  while (idx > 0) {
    const fieldName = filteredKeys[headerCount - idx] ?? "";
    const header = document.createElement("th");
    header.setAttribute("data-column", fieldName);
    header.textContent = namesArr[namesArr.length - idx] ?? "";
    thList.push(header);
    --idx;
  }
  return thList;
};

const getTableBody = (id: string) => {
  const tbody = document.querySelector(`#${id}`) as HTMLTableSectionElement;
  tbody.textContent = "";
  return tbody;
};

const createTableRows = <T>(data: T[]) => {
  const trList = [];
  let arrLen = data.length;
  let idx = arrLen;
  while (idx > 0) {
    const tr = document.createElement("tr");
    trList.push(tr);
    --idx;
  }
  return trList;
};

const createTableDataCells = (keys: string[]) => {
  const filteredKeys = filterKeys(keys);
  const tdList = filteredKeys.map((key) => {
    const td = document.createElement("td");
    td.setAttribute("class", key);
    return td;
  });
  return tdList;
};

const insertTextContent = <T>(td: HTMLTableCellElement, data: T) => {
  const key = td.getAttribute("class") ?? "";
  td.textContent = (data as any)[key] ?? "";
  return td;
};

export const createTableBody = <T>(id: string, keys: string[], data: T[]) => {
  const tbody = getTableBody(id);
  const trList = createTableRows(data);

  const arrLen = trList.length;
  let idx = arrLen;
  while (idx > 0) {
    const currIdx = arrLen - idx;
    const tr = trList[currIdx] as HTMLTableRowElement;
    const tdList = createTableDataCells(keys);
    tdList.map((td) => insertTextContent(td, data[currIdx]));
    tr.append(...tdList);
    tbody.appendChild(tr);
    --idx;
  }
};

export const secondcreateTableBody = <T>(
  data: T[],
  tableBody: HTMLTableSectionElement,
  columns: (keyof T)[],
  linkColumn?: { key: keyof T; baseUrl: string; linkKey: keyof T },
) => {
  tableBody.textContent = "";
  data.forEach((elem) => {
    const tr = document.createElement("tr");
    columns.forEach((column) => {
      const td = document.createElement("td");
      if (linkColumn && column === linkColumn.key) {
        const link = document.createElement("a");
        link.href = `${linkColumn.baseUrl}${elem[linkColumn.linkKey]}`;
        link.textContent = String(elem[column]);
        td.appendChild(link);
      } else {
        td.textContent = String(elem[column]);
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
};

export const sortData = <T>(
  data: T[],
  col: keyof T,
  direction: "asc" | "desc",
) => {
  const sortedData = [...data].sort((a, b) => {
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
