export type GenericObject = Record<string, any>;

export type NodeError = NodeJS.ErrnoException;

const processRoot = process.cwd();

export const toPascalCase = (original: string): string => {
  return original
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

export const toUpperFirst = (original: string): string => {
  return original.charAt(0).toUpperCase() + original.slice(1);
};

export const toLowerFirst = (original: string): string => {
  return original.charAt(0).toLowerCase() + original.slice(1);
};

export const addAdditionalProperties = (
  target: GenericObject,
  source: GenericObject,
): void => {
  const keyValArr = Object.entries(source);
  const missingKeysArr = keyValArr.filter(([key]) => !(key in target));
  const notInTarget = Object.fromEntries(missingKeysArr);
  Object.assign(target, notInTarget);
};

export const serializeError = (
  error: Error,
  omitStack = false,
): GenericObject => {
  const tag = (error as NodeError).code ?? error.name ?? "Error";
  const serialized: GenericObject = {
    message: `[${tag}] ${error.message}`,
  };
  if (!omitStack) {
    serialized["stack"] = (error.stack ?? "")
      .split("\n")
      .slice(1)
      .map((line) =>
        line
          .trim()
          .replace(/^at\s+/, "")
          .replace(processRoot, "$ROOT"),
      );
  }
  addAdditionalProperties(serialized, error);
  return serialized;
};
