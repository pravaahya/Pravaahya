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
        .replace(/"https:\/\/pravaahya\.com\/api/g, '"https://backend-rho-brown-23.vercel.app/api')
        .replace(/'https:\/\/pravaahya\.com\/api/g, "'https://backend-rho-brown-23.vercel.app/api")
        .replace(/`https:\/\/pravaahya\.com\/api/g, "`https://backend-rho-brown-23.vercel.app/api");

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed hardcoded URL in ' + file);
    }
}
