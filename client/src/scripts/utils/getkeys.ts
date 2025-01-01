const NOT_ALLOWED = ["shopId", "productId", "purchaseId"];

const filterKeys = <T>(keysArr: T[]) => {
  return keysArr.filter((key) => !NOT_ALLOWED.includes(key as string));
};

export const getKeys = <T>(dataList: T[]) => {
  const keys = dataList[0] ? (Object.keys(dataList[0]) as Array<keyof T>) : [];
  return filterKeys(keys);
};
