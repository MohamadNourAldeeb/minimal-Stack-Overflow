import sharp from "sharp";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { v4 as uuIdv4 } from "uuid";

async function moveFile(source, destination) {
    try {
        const fileExists = await fsExtra.pathExists(source);

        if (fileExists) {
            await fsExtra.move(source, destination, {
                overwrite: true,
                retryDelay: 500,
                retryAttempts: 3,
            });
        }
    } catch (error) {
        // console.error(error);
    }
}

// compress image and make it webp to use it as cover
export async function convertToWebp(inputFilename) {
    try {
        const outputDirectory = "public\\images";
        const dimensions = [
            { width: 200, height: 200 },
            { width: 400, height: 400 },
            { width: 1027, height: 400 },
        ];

        return await Promise.all(
            dimensions.map(async (dimension) => {
                const outputFilename = `${path.parse(inputFilename).name}_${
                    dimension.width
                }x${dimension.height}.webp`;
                sharp(inputFilename, { failOn: "truncated" })
                    .resize(dimension.width, dimension.height)
                    .toFormat("webp", {
                        quality: 50,
                        sequentialRead: false,
                    })
                    .toFile(outputFilename, async (err, info) => {
                        if (err) {
                            return { error: err };
                        } else {
                            await moveFile(
                                path.resolve() + "\\" + outputFilename,
                                path.resolve() +
                                    "\\" +
                                    outputDirectory +
                                    "\\" +
                                    outputFilename
                            );
                        }
                    });
                return outputFilename;
            })
        ).then((e) => {
            return e;
        });
    } catch (error) {
        // return { error };
    }
}

export async function removePic(filePath) {
    try {
        const fileHandle = await fs.promises.open(filePath, "r+");

        await fileHandle.close();

        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

        await fs.promises.unlink(filePath);
    } catch (error) {
        // console.log(error);
        if (error.code === "ENOENT") {
        }
    }
}
