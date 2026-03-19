const fs = require('fs');
const users = require('./data/users.json');
let meds = require('./data/medications.json');
let doses = require('./data/doseRecords.json');

const validUserIds = users.map(u => u.id);

meds = meds.filter(m => validUserIds.includes(m.userId) || validUserIds.includes(String(m.userId)));
doses = doses.filter(d => validUserIds.includes(d.userId) || validUserIds.includes(String(d.userId)));

fs.writeFileSync('./data/medications.json', JSON.stringify(meds, null, 2));
fs.writeFileSync('./data/doseRecords.json', JSON.stringify(doses, null, 2));

console.log('Cleaned databases. Kept only valid user records.');
