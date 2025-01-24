import zlib from "zlib";

function base64ToBuffer(base64) {
    try {
        // Validierung des Base64-Strings
        if (typeof base64 !== 'string' || !/^[a-zA-Z0-9+/=]+$/.test(base64)) {
            throw new Error("Ungültiger Base64-String");
        }
        return Buffer.from(base64, 'base64');
    } catch (err) {
        throw new Error(`Fehler bei Base64-Umwandlung: ${err.message}`);
    }
}

function decompressGzip(buffer) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(buffer, (err, decoded) => {
            if (err) {
                reject(new Error(`Fehler bei Dekomprimierung: ${err.message}`));
            } else {
                resolve(decoded.toString());
            }
        });
    });
}

export async function decompress(base64) {
    try {
        const buffer = base64ToBuffer(base64); // Schritt 1: Base64 in Buffer umwandeln
        const result = await decompressGzip(buffer); // Schritt 2: Gzip-Daten dekomprimieren
        return result;
    } catch (error) {
        //console.error(`Fehler in decompress: ${error.message}`); // Logging für bessere Debugging-Informationen
        return undefined;
    }
}