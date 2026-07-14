<template>
  <table>
    <slot />
  </table>
</template>

<script>
  import TrComponent from "./TrComponent.vue";

  export default {
    components:{
      TrComponent,
    },
    data(){
      return {
        message:'hello world',
      }
    },
    computed:{
      tableData(){
        return this.$store.state.tableData
      },
    },
  }
</script>