const fs = require('fs');
const env = fs.readFileSync('c:\\webDevProject\\genius\\.env', 'utf8');
const keyMatch = env.match(/GOOGLE_API_KEY=(.*)/);
if (!keyMatch) {
    console.log("No key found");
    process.exit(1);
}
const key = keyMatch[1].trim();

async function run() {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    if (data.models) {
        data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
    } else {
        console.log(data);
    }
}
run();
