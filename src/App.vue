<template>
    <div class="container">
        <h1 class="header">{{ name }}</h1>
        <div class="menu"><el-button type="primary" @click="enrollDialog = true">我要报名</el-button></div>

        <el-row class="title">
            <el-col :span="2">编号</el-col>
            <el-col :span="4">队名</el-col>
            <el-col :span="3">队长</el-col>
            <el-col :span="3">左护法</el-col>
            <el-col :span="3">右护法</el-col>
            <el-col :span="6">备注</el-col>
            <el-col :span="3">操作</el-col>
        </el-row>

        <el-row class="content" :key="idx" v-for="(team, idx) in teams">
            <el-col :span="2">{{ idx + 1 }}</el-col>
            <el-col :span="4">{{ team.name }}</el-col>
            <el-col :span="3">{{ team.a.name }}</el-col>
            <el-col :span="3">{{ team.c.name }}</el-col>
            <el-col :span="3">{{ team.m.name }}</el-col>
            <el-col :span="6" class="remark">
                {{ team.desc }}
            </el-col>
            <el-col :span="3">
                <el-button type="danger" size="medium" @click="handleDelete(team.id)" plain>删除</el-button>
            </el-col>
        </el-row>

        <el-dialog title="请填写报名信息" :visible.sync="enrollDialog" width="500px">
            
            <el-form ref="form" :model="team" label-width="80px">

                <el-form-item label="* 队伍名称">
                    <el-input v-model="team.name" placeholder="请问各位大佬是哪个门派的？" :maxlength="20"></el-input>
                </el-form-item>

                <el-form-item label="参赛口号">
                    <el-input type="textarea" v-model="team.desc" placeholder="这个队伍一点儿都不懒，可是还是什么都没有留下。" :maxlength="60"></el-input>
                </el-form-item>

                <el-form-item label="* 退隐江湖">
                    <el-input v-model="team.key" type="password" placeholder="可通过此密码删除报名信息" :maxlength="20"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-radio-group v-model="choose">
                        <el-radio-button label="青龙护法"></el-radio-button>
                        <el-radio-button label="队长大人"></el-radio-button>
                        <el-radio-button label="白虎护法"></el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="(choose === '队长大人' ? '* ' : '') + '姓名'">
                    <el-input v-model="who.name" :placeholder="'敢问 ' + choose + ' 尊姓大名？'" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item :label="(choose === '队长大人' ? '* ' : '') + '学号'">
                    <el-input v-model="who.number" :placeholder="'请教 ' + choose + ' 您的出厂编号？'" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item :label="(choose === '队长大人' ? '* ' : '') + '电话'">
                    <el-input v-model="who.mobile" :placeholder="'还请 ' + choose + ' 留下联系方式'" :maxlength="20"></el-input>
                </el-form-item>

                <el-form-item :label="(choose === '队长大人' ? '* ' : '') + '性别'">
                    <el-select v-model="who.sex" model="" :placeholder="'冒昧问一下 ' + choose + ' 是少侠还是女侠？'">
                        <el-option label="少侠" value="1"></el-option>
                        <el-option label="女侠" value="0"></el-option>
                    </el-select>
                </el-form-item>
     
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">立即报名</el-button>
                    <el-button @click="enrollDialog = false">取消</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

    </div>
</template>

<script>

import axios from 'axios';

export default {
    data: () => ({
        name: '2017 SAU ACM 校赛报名',
        enrollDialog: false,
        choose: '队长大人',
        team: {
            name: '',
            desc: '',
            key: '',
            a: { name: '', number: '', mobile: '', sex: '' },
            c: { name: '', number: '', mobile: '', sex: '' },
            m: { name: '', number: '', mobile: '', sex: '' },
        },
        teams: []
    }),
    computed: {
        who () {
            switch (this.choose) {
                case '队长大人': return this.team.a;
                case '青龙护法': return this.team.c;
                case '白虎护法': return this.team.m;
            }
        }
    },
    methods: {
        async handleSubmit () {
            let { name, desc, key, a, c, m } = this.team;
            if (!desc) this.team.desc = '这个队伍一点儿都不懒，可是还是什么都没有留下。';
            if (!name) { this.$message('请输入队名'); return; }
            if (!key) { this.$message('请输入退隐江湖密码，可通过此密码删除报名信息。'); return; }
            if (!a.name || !a.number || !a.mobile || !a.sex) { this.$message('请完整填写 队长大人 的信息。'); return; }
            if ((c.name || c.number || c.mobile || c.sex) && (!c.name || !c.number || !c.mobile || !c.sex)) {
                this.$message('请完整填写 青龙护法 的信息。'); return;
            }
            if ((m.name || m.number || m.mobile || m.sex) && (!m.name || !m.number || !m.mobile || !m.sex))  {
                this.$message('请完整填写 白虎护法 的信息。'); return;
            }

            let { data: res } = await axios.post('/teams', this.team);
            if (res.errcode) this.$message(res.errmsg);
            else {
                if (!c.name && !m.name) this.$message('围观大佬一人打爆全场！');
                else if (!c.name || !m.name) this.$message('祝二位百年好合，早生贵子！');
                else this.$message('报名成功！祝三位大佬旗开得胜！');
                this.enrollDialog = false;
                this.refresh();
            }
        },
        async handleDelete (id) {
            this.$prompt('请输入删除密码', '删除队伍').then(async ({ value: key }) => {
                let { data: res } = await axios.delete('/teams', { headers: {id, key } });
                if (res.errcode) this.$message(res.errmsg);
                else this.$message('删除成功！');
                this.refresh();
            });
        },
        async refresh () {
            let { data: res } = await axios.get('/teams');
            if (res.errcode) this.$message(res.errmsg);
            else this.teams = res.data;
        }
    },
    async created () {
        this.refresh();
    }
};
</script>

<style lang="scss">

.container {
    width: 95%;
    margin: 0 auto;
}

.header {
    color: #77879d;
    text-align: center;
}

.menu {
    text-align: center;
}


.el-row .el-col {
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
}

.title {
    margin-top: 10px;
    background-color: #99a9bf;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.content {
    background-color: #d3dce6;

    &:nth-last-child(2n) {
        background-color: #e5e9f2;
    }
}

.el-select {
    width: 100%;
}

</style>
