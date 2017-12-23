const xlsx = require('node-xlsx').default;
const sqlite3 = require('sqlite3');
const fs = require('fs');

let db = new sqlite3.Database('./teams.db');

let getData = db => new Promise(resolve => {
    db.all('select name, a, c, m from teams', (err, rows) => {
        if (err) return ;
        resolve(rows);
    });
});

let parseTeamData = row => {
    let parseAcmer = json => {
        let data = JSON.parse(json);
        return [data.name, data.sex === '1' ? '男' :
            data.sex === '0' ? '女' : '', data.number, data.mobile];
    }
    return [row.name].concat(parseAcmer(row.a), parseAcmer(row.c), parseAcmer(row.m));
};

getData(db).then(rows => {
    let data = [ ['队伍名称', '队长姓名', '队长性别', '队长学号', '队长电话', '队员一姓名', '队员一性别', '队员一学号', '队员一电话', '队员二姓名', '队员二性别', '队员二学号', '队员二电话'] ];
    rows.forEach(row => data.push(parseTeamData(row)));
    buffer = xlsx.build([{name: '队伍信息', data}]);
    fs.writeFileSync('output.xls', buffer);
});

// const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
// var buffer = xlsx.build([{name: "mySheetName", data: data}]);

// fs.writeFileSync('output.xls', buffer);

