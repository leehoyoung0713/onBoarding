import { createApp } from 'vue';
import TicTacToe from './TicTacToe.vue';
import store from './store';


const app=createApp(TicTacToe);
app.use(store);
app.mount('#root')