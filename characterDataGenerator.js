/**
 * This file is used to import the character portraits to base64 from raw assets
 */

const fs = require('fs');
const characterData = require('./rawAssets/data/adventurers.json');

for (const character of characterData) {
    try {
        const base64 = base64_encode(`./rawAssets/img/portraits/${character.id}.png`);
        character.portrait = "data:image/png;base64,"+base64;
    } catch (e) {
        console.error(`Error: Didn't find portrait for ${character.id}`);
    }
}

fs.writeFileSync('./public/data/adventurers.json', JSON.stringify(characterData, null, 2), "utf-8");

function base64_encode(file) {
    return fs.readFileSync(file, "base64");
}