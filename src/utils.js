
import {fileURLToPath} from "url";
import {dirname} from "path";

const filename = fileURLToPath(import.meta.url);
export const root = dirname(filename);
