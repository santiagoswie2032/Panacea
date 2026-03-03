import fs from 'fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

const users = readJson('./data/users.json');
let meds = readJson('./data/medications.json');
let doses = readJson('./data/doseRecords.json');

const validUserIds = users.map((u) => u.id);

meds = meds.filter(
    (m) => validUserIds.includes(m.userId) || validUserIds.includes(String(m.userId))
);
doses = doses.filter(
    (d) => validUserIds.includes(d.userId) || validUserIds.includes(String(d.userId))
);

fs.writeFileSync('./data/medications.json', JSON.stringify(meds, null, 2));
fs.writeFileSync('./data/doseRecords.json', JSON.stringify(doses, null, 2));

console.log('Cleaned databases. Kept only valid user records.');
