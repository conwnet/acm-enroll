const Koa = require('koa');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const sqlite3 = require('sqlite3');

const app = new Koa();
const db = new sqlite3.Database('./teams.db');

app.use(bodyParser());

let getData = rows => {
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        desc: row.desc,
        a: { name: JSON.parse(row.a).name },
        c: { name: JSON.parse(row.c).name },
        m: { name: JSON.parse(row.m).name }
    }));
}

let getAllTeams = () => new Promise(resolve => {
    db.all('select id, name, desc, a, c, m from teams', async (err, rows) => {
        resolve({ err, rows });
    });
});

let addTeam = (name, desc, key, a, c, m) => new Promise(resolve => {
    db.run('insert into teams (name, desc, key, a, c, m) values (?, ?, ?, ?, ?, ?)',
        name, desc, key, JSON.stringify(a), JSON.stringify(c), JSON.stringify(m), async err => {
        resolve({ err });
    });
});

let delTeam = (id, key) => new Promise(resolve => {
    db.get('select key from teams where id = ?', id, (err, row) => {
        if (err) resolve({ err });
        else if (!row) resolve({ err: { errcode: 3000, errmsg: '用户不存在！' } });
        else if (key !== row.key) resolve({ err: { errcode: 3001, errmsg: '密码错误！' } });
        else db.run('delete from teams where id = ?', id, err => {
            resolve({ err });
        })
    })
    
});

app.use(async (ctx, next) => {
    if (ctx.request.path === '/teams') {
        ctx.response.type = 'application/json';
        // GET 方法请求队伍信息
        if (ctx.request.method === 'GET') {
            let { err, rows } = await getAllTeams();
            if (err) ctx.response.body = { errcode: 2000, errmsg: '我也不知道为什么出错了...' };
            else ctx.response.body = { errcode: 0, errmsg: '查询成功！', data: getData(rows) };
        // POST 方法提交队伍信息
        } else if (ctx.request.method === 'POST') {
            let { name, desc, key, a, c, m } = ctx.request.body;
            let { err, rows } = await getAllTeams();
            if (err) ctx.response.body = { errcode: 2000, errmsg: '我也不知道为什么出错了...' };
            else if (rows.some(r => r.name === name)) ctx.response.body = { errcode: 1000, errmsg: '队名已存在！' }
            else {
                let { err } = await addTeam(name, desc, key, a, c, m);
                if (err) ctx.response.body = { errcode: 2000, errmsg: '我也不知道为什么出错了...' };
                else ctx.response.body = { errcode: 0, errmsg: '报名成功！' }
            }
        } else if (ctx.request.method === 'DELETE') {
            let { id, key } = ctx.request.header;
            let { err } = await delTeam(id, key);
            if (err) ctx.response.body = (err.errcode && err) || ({ errcode: 2000, errmsg: '我也不知道为什么出错了...' });
            else ctx.response.body = { errcode: 0, errmsg: '删除成功！' }
        }
    } 
    await next();
})

app.use(static('dist'));
app.listen(80);

