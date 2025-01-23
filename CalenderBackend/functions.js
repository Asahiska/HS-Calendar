import zlib from "zlib";

function base64ToBuffer(base64) {
    return Buffer.from(base64, 'base64');
}

function decompressGzip(buffer) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(buffer, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded.toString());
            }
        });
    });
}

export async function decompress(base64) {
    try {
        const buffer = base64ToBuffer(base64);
        return  decompressGzip(buffer);
    } catch (error) {
        return undefined;
    }
}