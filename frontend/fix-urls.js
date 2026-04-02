const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Users/Dell/OneDrive/Desktop/Startup/Pravaahya/Website/frontend/src';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(targetDir);
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const newContent = content
        .replace(/"http:\/\/(?:127\.0\.0\.1|localhost):5000\/api/g, '"https://pravaahya.com/api')
        .replace(/'http:\/\/(?:127\.0\.0\.1|localhost):5000\/api/g, "'https://pravaahya.com/api")
        .replace(/`http:\/\/(?:127\.0\.0\.1|localhost):5000\/api/g, "`https://pravaahya.com/api");

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated ' + file);
    }
}
