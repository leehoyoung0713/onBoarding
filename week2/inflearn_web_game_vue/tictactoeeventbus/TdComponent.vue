<template>
  <td @click="onClickTdOriginal">{{cellData}}</td>
</template>

<script>
  import EventBus from "./EventBus";
  export default {
    props: {
      cellData:String,
      cellIndex:Number,
      rowIndex:Number,
    },
    methods: {
      onClickTdOriginal() {
        if(this.cellData) return;
        EventBus.$emit('clickTd');
      }
    }
  }
</script>