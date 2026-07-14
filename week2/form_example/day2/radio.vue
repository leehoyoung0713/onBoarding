<script setup>
import {ref,reactive} from 'vue'

const form=reactive({
  name:'',
  gender:'',
})

const errors=reactive({
  name:'',
  gender:'',
})

function validate(){
  errors.name=form.name ? '' : '이름을 입력해주세요'
  if(errors.name) return false
  errors.gender=form.gender ? '' : '성별을 선택해주세요'
  if(errors.gender) return false
  return true
}

const isSubmitting=ref(false)
const submitResult=ref(null)

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
        name:form.name,
        gender:form.gender,
      }),
    })
   
    if(!res.ok){throw new Error(`서버 오류 : ${res.status}`)}
    submitResult.value=`응답 성공: ${res.status}`
  } catch(e){
    submitResult.value=`응답 실패: ${e.message}`
  } finally{
    isSubmitting.value=false
  }
 
  function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms))
  }
 
}

</script>

<template>
	<form @submit.prevent="handleForm">
    <div class="field">
      <label>이름</label>
      <input type="text" v-model="form.name" placeholder="입력해주세요"/>
      <p v-if="errors.name" style="color:red;">{{errors.name}}</p>
    </div>
    <div class="field">
      <label><input type="radio" value="male" v-model="form.gender"/>남성</label>
      <label><input type="radio" value="female" v-model="form.gender"/>여성</label>
      <p v-if="errors.gender" style="color:red;">{{errors.gender}}</p>
    </div>
    <button :disabled="isSubmitting">{{isSubmitting?'제출 중...':'제출'}}</button>
    <p v-if="submitResult">{{submitResult}}</p>
  </form>
</template>
