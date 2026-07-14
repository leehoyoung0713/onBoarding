<script setup>
import {ref,reactive,computed,watch} from 'vue'
const categoryMap={
  'fruit':[
    {value:'apple',label:'사과'},
    {value:'banana',label:'바나나'},
  ],
  'vegetable':[
    {value:'carrot',label:'당근'},
    {value:'potato',label:'감자'},
  ],
}

const form=reactive({
  category:'',
  subCategory:'',
  quantity:1
})

const errors=reactive({
  category:'',
  subCategory:'',
  quantity:'',
})

const subCategoryMap=computed(()=>{
	return form.category ? categoryMap[form.category] : []
})

// category가 바뀌면 subCategory 선택값을 초기화 (기존 선택이 무효해지므로)
watch(() => form.category, () => {
  form.subCategory = ''
})

function validate(){
  errors.category=form.category ? '' : '상위 카테고리를 선택해주세요'
  if(errors.category) return false
  errors.subCategory=form.subCategory ? '' : '하위 카테고리를 선택해주세요'
  if(errors.subCategory) return false
  errors.quantity=form.quantity ? '' : '수량을 선택해주세요'
  if(errors.quantity) return false
  return true
}

const isSubmitting=ref(false)
const submitResult=ref(null)

function delay(ms){
  return new Promise(resolve=>setTimeout(resolve,ms))
}

async function handleForm(){
  if(!validate())return
 
  isSubmitting.value=true
  submitResult.value=null
 
  try{
    await delay(2000)
    const res=await fetch('/api/users',{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        category:form.category,
        subCategory:form.subCategory,
        quantity:form.quantity,
      }),
    })
   
    if(!res.ok){throw new Error(`서버 오류 : ${res.status}`)}
    submitResult.value=`응답 성공! ${res.status}`
  } catch(e){
    submitResult.value=`응답 실패! ${e.message}`
  } finally{
    isSubmitting.value=false
  }
}

</script>

<template>
	<form @submit.prevent="handleForm">
    <div class="field">
      <label>상위 카테고리</label>
      <select v-model="form.category">
        <option disabled value="">선택하세요</option>
        <option value="fruit">과일</option>
        <option value="vegetable">채소</option>
      </select>
      <p v-if="errors.category" style="color:red;">{{errors.category}}</p>
    </div>
   
    <div class="field">
      <label>하위 카테고리</label>
      <select v-model="form.subCategory" :disabled="!form.category">
        <option disabled value="">선택하세요</option>
        <option v-for="sub in subCategoryMap"
                :key="sub.value"
                :value="sub.value">{{sub.label}}</option>
      </select>
      <p v-if="errors.subCategory" style="color:red;">{{errors.subCategory}}</p>
    </div>
   
    <div class="field">
      <label>수량</label>
      <select v-model.number="form.quantity">
        <option v-for="n in 5" :key="n" :value="n">{{n}}</option>
      </select>
      <p v-if="errors.quantity" style="color:red;">{{errors.quantity}}</p>
    </div>
    <button :disabled="isSubmitting">{{isSubmitting ? '제출 중..':'제출'}}</button>
    <p v-if="submitResult">{{submitResult}}</p>
  </form>
</template>
