
const ENCODED = "CBMikwFBVV95cUxpRDk1TVQtVEt0OThxYm45eU0wdzF1eUVsLXlqRzNsTkxFYzZ0Z0lzbFcwX1d4ZzdFV2k5c05tZkZJcDBjR0VpQ21oT1BIV2tzZDVwYW1jR1J6aTBDbE5qVEh3b01lZThxYlY3SVRnS2R4N1dZbWpJbW5lZWN5M3BtNmRyMHh6cDhvLUFCS05QZw";

function decode(str: string) {
    // Base64 decode
    const buff = Buffer.from(str, 'base64');
    const text = buff.toString('utf-8'); // or latin1?

    console.log('--- Decoded (UTF-8) ---');
    console.log(text);

    // Often it contains the URL preceded by some binary junk
    // We can regex for http(s)
    const match = text.match(/(https?:\/\/[^\s\x00-\x1F]+)/);
    if (match) {
        console.log('\n--- Found URL ---');
        console.log(match[0]);
    } else {
        console.log('\n--- No URL found ---');
    }
}

decode(ENCODED);
