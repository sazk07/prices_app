const NOT_ALLOWED = ["shopId", "productId", "purchaseId"];

const filterKeys = <T>(keysArr: T[]) => {
  return keysArr.filter((key) => {
    const kStr = String(key);
    return !NOT_ALLOWED.includes(kStr);
  });
};

export const getKeys = <T>(dataList: T[]) => {
  const firstObj = dataList[0];
  const keys = firstObj ? (Object.keys(firstObj) as Array<keyof T>) : [];
  return filterKeys(keys);
};
