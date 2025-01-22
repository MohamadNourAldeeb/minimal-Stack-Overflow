import path, { join } from "path";
import { promises as fsPromises } from "fs";
import { fileURLToPath } from "url";

const url = import.meta.url;
const __filename = fileURLToPath(url);
const __dirname = path.dirname(__filename);

let fileProcessing = {
    deleteFile: async (file_name) => {
        try {
            let filePath = join(__dirname, "../public/images");
            const imageName = file_name.split(".")[0];
            await fsPromises.unlink(join(filePath, file_name));
            await fsPromises.unlink(join(filePath, `${imageName}_comp.webp`));
        } catch (error) {
            throw Error(`there are error in delete images : ${error}`);
        }
    },
};

export default fileProcessing;
