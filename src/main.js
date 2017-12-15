import Vue from 'vue';
import App from './App.vue';
import { Button, Row, Col, Dialog, Form, FormItem, Input, RadioGroup, RadioButton, Select, Option, Message, MessageBox } from 'element-ui';

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Select);
Vue.use(Option);

Vue.prototype.$message = Message;
Vue.prototype.$prompt = MessageBox.prompt;

new Vue({
    el: '#root',
    render: h => h(App)
});