
// Based on community reverse-engineering of Google News URLs (Protobuf-ish)

const ENCODED_URL = "CBMikwFBVV95cUxpRDk1TVQtVEt0OThxYm45eU0wdzF1eUVsLXlqRzNsTkxFYzZ0Z0lzbFcwX1d4ZzdFV2k5c05tZkZJcDBjR0VpQ21oT1BIV2tzZDVwYW1jR1J6aTBDbE5qVEh3b01lZThxYlY3SVRnS2R4N1dZbWpJbW5lZWN5M3BtNmRyMHh6cDhvLUFCS05QZw";

function decodeGoogleNewsUrl(encoded: string) {
    try {
        // Fix standard padding if needed
        let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) { b64 += '='; }

        const buff = Buffer.from(b64, 'base64');

        // Strategy: Search for URL indicators (http/https)
        // This is a naive heuristic because the protobuf structure varies
        let str = buff.toString('binary'); // Preserve bytes as 1-1 mapping

        // Find indices of "http"
        const httpIndices = [];
        for (let i = 0; i < str.length; i++) {
            if (str.substring(i, i + 4) === 'http') {
                httpIndices.push(i);
            }
        }

        console.log(`Found ${httpIndices.length} http candidates.`);

        for (const idx of httpIndices) {
            // Read until a non-printable char or unusual terminator
            // URLs usually end with null or control chars in these buffers
            // Or look for length prefix (which is hard without proto definition)

            let url = '';
            for (let i = idx; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                // URLs generally are printable, printable ASCII ranges: 33-126
                if (charCode >= 32 && charCode <= 126) {
                    url += str[i];
                } else {
                    break;
                }
            }
            console.log(`Candidate: ${url}`);

            // Validate
            if (url.startsWith('http') && url.includes('.')) {
                return url;
            }
        }

    } catch (e) {
        console.error(e);
    }
    return null;
}

const res = decodeGoogleNewsUrl(ENCODED_URL);
console.log('Final Result:', res);
