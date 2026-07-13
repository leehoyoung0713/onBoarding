import { createApp } from 'vue';
import Router from './Router.vue';
import routes from './routes';

const app=createApp(Router);
app.use(routes);
app.mount('#root')