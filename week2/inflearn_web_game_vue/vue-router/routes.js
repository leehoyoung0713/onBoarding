import {createRouter,createWebHistory} from 'vue-router';
import NumberBaseball from '../numberBaseball/NumberBaseball';
import ResponseCheck from '../responseCheck/ResponseCheck';
import RockScissorsPaper from '../rockScissorsPaper/RockScissorsPaper';
import LottoGenerator from '../lottoGenerator/LottoGenerator';
import GameMather from './GameMatcher';
export default createRouter({
    mode:'history',
    history:createWebHistory(),
    routes:[
        { path: '/', redirect: '/number-baseball' },
        {path:'/number-baseball',component:NumberBaseball},
        {path:'/response-check',component:ResponseCheck},
        {path:'/rock-scissors-paper',component:RockScissorsPaper},
        {path:'/lotto-generator',component:LottoGenerator},
        {path:'/game/:name',component:GameMather},// /game/number-baseball
    ],
})