import { createApp } from 'vue';
import MineSweeper from './MineSweeper.vue';
import store from './store';


const app=createApp(MineSweeper);
app.use(store);
app.mount('#root')