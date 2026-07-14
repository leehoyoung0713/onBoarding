<template>
  <div>
    <div>{{turn}}님의 턴입니다.</div>
    <table-component :table-data="tableData" />
    <div v-if="winner">{{winner}}님의 승리!</div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import TableComponent from "./TableComponent.vue";
  import EventBus from "./EventBus";

  export default {
    components:{
      TableComponent
    },
    data(){
      return {
      };
    },
    computed:{

    },
    methods: {
      onChangeData(){
        // this.tableData[1][0]='X'; 작동하지 않음
      },
      onClickTd(){
        this.tableData[this.rowIndex][this.cellIndex]=this.turn;

        let win =false;
        if(this.tableData[this.rowIndex][0]===this.turn && this.tableData[this.rowIndex][1]===this.turn && this.tableData[this.rowIndex][2]===this.turn){
          win=true;
        }
        if(this.tableData[0][this.cellIndex]===this.turn && this.tableData[1][this.cellIndex]===this.turn && this.tableData[2][this.cellIndex]===this.turn){
          win=true;
        }
        if(this.tableData[0][0]===this.turn && this.tableData[1][1]===this.turn && this.tableData[2][2]===this.turn){
          win=true;
        }
        if(this.tableData[0][2]===this.turn && this.tableData[1][1]===this.turn && this.tableData[2][0]===this.turn){
          win=true;
        }

        if(win){// 이긴경우
          this.winner=this.turn;
          this.turn='O';
          this.tableData=[['','',''],['','',''],['','','']];
        }else{// 무승부
          let all=true;
          this.tableData.forEach((row)=>{
            row.forEach((cell)=>{
              if(!cell){all=false;}
            });
          });
          if(all){
            this.winner='';
            this.turn='O';
            this.tableData=[['','',''],['','',''],['','','']];
          }
          this.turn=this.turn==='O'?'X':'O';
        }
      },
    },
    created(){
      EventBus.$on('clickTd',this.onClickTd);
    },
    mounted(){

    },
    beforeDestroy() {

    },
    watch :{

    }
  };
</script>

<style>
  table {
    border-collapse:collapse;
  }
  td {
    border:1px solid black;
    width:40px;
    height:40px;
    text-align:center;
  }
</style>