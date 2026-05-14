
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class GenericManager {
    constructor(fileName) {
        
        const dataFolder = path.join(__dirname, "data"); 
        this.filePath = path.join(dataFolder, fileName);

        if (!fs.existsSync(dataFolder)) {
            fs.mkdirSync(dataFolder, { recursive: true });
        }

        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]), "utf-8");
        }
    }
}