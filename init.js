const sql = `
create table teams (
    id integer primary key autoincrement,
    name varchar(30),
    desc varchar(70),
    key varchar(30),
    a varchar(1024),
    c varchar(1024),
    m varchar(1024)
);
`;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('teams.db');

db.exec(sql, err => {
    if (err) console.log(err);
    else console.log('创建完成！');
});