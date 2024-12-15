import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import { cwd } from "node:process";

// Create database directory
const createDir = async () => {
  const currDir = fileURLToPath(new URL(".", import.meta.url));
  const targetDir = join(currDir, "../../../database");
  const processRoot = cwd();
  const defaultDatabaseDir = processRoot.endsWith("server")
    ? "../database"
    : "./database";
  const dirPathStr =
    (await mkdir(targetDir, { recursive: true })) ?? defaultDatabaseDir;
  return dirPathStr;
};

const connectToDatabase = async () => {
  try {
    const createdTargetDir = await createDir();
    const dbPath = resolve(createdTargetDir, "prices.db");
    const db = new DatabaseSync(dbPath);
    return db;
  } catch (err) {
    console.error("Error connecting to sqlite database:", err);
    throw err;
  }
};

export default connectToDatabase;
