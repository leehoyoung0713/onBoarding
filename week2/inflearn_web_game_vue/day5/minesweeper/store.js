import Vuex from 'vuex';


// 게임 시작
export const START_GAME='START_GAME';
// 칸 열기
export const OPEN_CELL='OPEN_CELL';
// 지뢰 클릭
export const CLICK_MINE='CLICK_MINE';
// 깃발 표시
export const FLAG_CELL='FLAG_CELL';
// 지뢰 의심
export const QUESTION_CELL='QUESTION_CELL';
// 깃발 표시, 지뢰 의심 해제
export const NORMALIZE_CELL='NORMALIZE_CELL';
// 타이머 증가
export const INCREMENT_TIMER='INCREMENT_TIMER';

export const CODE={
    MINE:-7,
    NORMAL:-1,
    QUESTION:-2,
    FLAG:-3,
    QUESTION_MINE:-4,
    FLAG_MINE:-5,
    CLICKED_MINE:-6,
    OPENED:0, // 0 이상이면 다 opened
};

const plantMine=(row,cell,mine)=>{
    console.log(row,cell,mine);
    // 0부터 row*cell값까지 candidate 배열에 순서대로 추가한다.
    const candidate=Array(row*cell).fill().map((arr,i)=>{
        return i;
    });
    // 중복 없이 무작위로 mine개를 뽑아 shuffle 배열에 담는다
    const shuffle=[];
    while(candidate.length > row*cell - mine){
        const chosen=candidate.splice(Math.floor(Math.random()*candidate.length),1)[0];
        shuffle.push(chosen);
    }
    // 지뢰가 아닌 일반 값들을 추가한다?(CODE.NORMAL='')
    const data=[];
    for(let i=0;i<row;i++){
        const rowData=[];
        data.push(rowData);
        for(let j=0;j<cell;j++){
            rowData.push(CODE.NORMAL);
        }
    }

    // 지뢰 숫자를 담은 배열을 순회하면서 위치에 맞게 CODE.MINE값을 설정한다.(CODE.MINE=X)
    for(let k=0;k<shuffle.length;k++){
        const ver=Math.floor(shuffle[k]/cell);
        const hor=shuffle[k]%cell;
        data[ver][hor]=CODE.MINE;
    }

    console.log(data);
    return data;
}

export default new Vuex.Store({
    state: {
        tableData:[],
        data:{
            row:0,
            cell:0,
            mine:0,
        },
        timer:0,
        halted:true, // 중단됨
        result:'',
        openedCount:0,
    },// vue의 data와 비슷
    getters: {

    },// vue의 computed와 비슷
    mutations: {
        [START_GAME](state,{row,cell,mine}){
            state.data={
                row,
                cell,
                mine,
            };
            state.tableData=plantMine(row,cell,mine);
            state.timer=0;
            state.halted=false;
            state.openedCount=0;
            state.result='';
        },
        [OPEN_CELL](state,{row,cell}){
            let openedCount=0;
            const checked=[];
            function checkAround(row,cell) {// 주변 8칸 지뢰인지 검색
                // null체크
                const checkRowOrCellIsUndefined=row<0 || row>=state.tableData.length || cell < 0 || cell >= state.tableData[0].length;
                if(checkRowOrCellIsUndefined){
                    return;
                }
                // 열렸거나, 깃발이 있거나, 지뢰 의심 부분은 제외
                if([CODE.OPENED,CODE.FLAG,CODE.FLAG_MINE,CODE.QUESTION_MINE,CODE.QUESTION].includes(state.tableData[row][cell])){
                    return;
                }
                //
                if(checked.includes(row+'/'+cell)){
                    return;
                }else{
                    checked.push(row+'/'+cell);
                }
                // 내가 클릭한 위치의 주변 동/서/남/북 대각선방향 배열에 추가
                let around = [];
                if (state.tableData[row - 1]) {
                    around = around.concat([
                        state.tableData[row - 1][cell - 1], state.tableData[row - 1][cell], state.tableData[row - 1][cell + 1],
                    ]);
                }
                if (state.tableData[row]) {
                    around = around.concat([
                        state.tableData[row][cell - 1], state.tableData[row][cell + 1],
                    ]);
                }
                if (state.tableData[row + 1]) {
                    around = around.concat([
                        state.tableData[row + 1][cell - 1], state.tableData[row + 1][cell], state.tableData[row + 1][cell + 1],
                    ]);
                }
                // 주변 8칸의 값들 중 지뢰/지뢰깃발/지뢰의심(우클릭)에 해당하는 값들만 걸러낸 배열(ex) counted=[[CODE.MINE],[CODE.FLAG_MINE]])
                const counted = around.filter(function (v) {
                    return [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v);
                });
                // 주변에 지뢰(의심 포함)가 몇 개 있는지 개수를 현재 칸의 값으로 저장 (지뢰찾기에서 숫자가 표시되는 부분)
                state.tableData[row][cell] = counted.length;  // ← 각 칸마다 여기서 바로 저장해야 함
                openedCount+=1;
                // 주변에 지뢰/지뢰깃발/지뢰의심(우클릭) 부분이 없을 경우만
                if(counted.length===0 && row > -1){// 주변칸에 지뢰가 하나도 없으면
                    // 동/서/남/북 대각선방향 배열에 추가
                    const near=[];
                    if(row -1 > -1){
                        if(cell-1 > -1) near.push([row-1,cell-1]);
                        near.push([row-1,cell]);
                        if(cell+1 < state.tableData[row].length) near.push([row-1,cell+1]);
                    }
                    if(cell-1 > -1) near.push([row,cell-1]);
                    if(cell+1 < state.tableData[row].length) near.push([row,cell+1]);
                    if(row +1 < state.tableData.length){          // ← 부등호/비교대상 수정
                        if(cell-1 > -1) near.push([row+1,cell-1]);
                        near.push([row+1,cell]);
                        if(cell+1 < state.tableData[row].length) near.push([row+1,cell+1]);
                    }

                    // 인접한 위치가 현재 열려있지 않은 경우만 자기 자신 호출(재귀호출)
                    near.forEach((n)=>{
                        if(state.tableData[n[0]][n[1]]!==CODE.OPENED){
                            checkAround(n[0],n[1]);
                        }
                    })
                }
                return counted.length;
            }
            // 클릭 위치 주변에 지뢰/지뢰깃발/지뢰의심(우클릭) 부분 확인하여 개수 표시
            const count=checkAround(row,cell);
            let halted=false;
            let result;
            if(state.data.row*state.data.cell-state.data.mine===state.openedCount+openedCount){
                halted=true;
                result=`${state.timer}초만에 승리하셨습니다.`;
            }
            state.openedCount+=openedCount;
            state.halted=halted;
            state.result=result;
            //state.tableData[row][cell]=count;
        },
        [CLICK_MINE](state,{row,cell}){
            state.halted=true;
            state.tableData[row][cell]=CODE.CLICKED_MINE;
        },
        [FLAG_CELL](state,{row,cell}){
            if(state.tableData[row][cell]===CODE.MINE){
                state.tableData[row][cell]=CODE.FLAG_MINE;
            }else{
                state.tableData[row][cell]=CODE.FLAG;
            }
        },
        [QUESTION_CELL](state,{row,cell}){
            if(state.tableData[row][cell]===CODE.FLAG_MINE){
                state.tableData[row][cell]=CODE.QUESTION_MINE;
            }else{
                state.tableData[row][cell]=CODE.QUESTION;
            }
        },
        [NORMALIZE_CELL](state,{row,cell}){
            if(state.tableData[row][cell]===CODE.QUESTION_MINE){
                state.tableData[row][cell]=CODE.MINE;
            }else{
                state.tableData[row][cell]=CODE.NORMAL;
            }
        },
        [INCREMENT_TIMER](state){
            state.timer+=1;
        },

    },// state를 수정할 때 사용해요. 동기적으로
    actions:{

    },// 비동기를 사용할때, 또는 여러 뮤테이션을 연달아 실행할 때
})