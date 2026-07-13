<script setup>
import { ref, computed, watchEffect } from 'vue'

let id = 0
const chkArr = ref([
  { id: id++, text: 'apple', checked: false },
  { id: id++, text: 'banana', checked: false },
  { id: id++, text: 'mango', checked: false },
])

const allChecked = computed({
  // get() — 전체 선택 체크박스의 표시 상태
  get() {
    return chkArr.value.every(chk => chk.checked)
  },
  // set(value) — 전체 선택 체크박스를 직접 클릭했을 때
  set(value) {
    chkArr.value.forEach(chk => { chk.checked = value })
  }
})

const checkedCount = computed(() =>
  chkArr.value.filter(chk => chk.checked).length
)

const statusText = computed(() => {
  if (checkedCount.value === 0) return '선택된 항목이 없습니다'
  if (checkedCount.value === chkArr.value.length) return '전체가 선택되었습니다'
  return `${checkedCount.value}개가 선택됐습니다`
})

const isIndeterminate = computed(() =>
  checkedCount.value > 0 && checkedCount.value < chkArr.value.length
)

const allCheckboxRef = ref(null)
watchEffect(() => {
  if (allCheckboxRef.value) {
    allCheckboxRef.value.indeterminate = isIndeterminate.value
  }
})

// 폼 제출 처리
function handleSubmit() {
  const selected = chkArr.value
    .filter(chk => chk.checked)
    .map(chk => chk.text)

  if (selected.length === 0) {
    alert('선택된 항목이 없습니다')
    return
  }

  console.log('제출된 값:', selected)
  alert(`제출: ${selected.join(', ')}`)
  // 실제로는 여기서 API 호출: axios.post('/api/xxx', { selected })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input
        type="checkbox"
        id="chk-all"
        ref="allCheckboxRef"
        v-model="allChecked"
      />
      <label for="chk-all">전체 선택</label>
    </div>

    <hr />

    <div v-for="chk in chkArr" :key="chk.id">
      <input
        type="checkbox"
        :id="`fruit-${chk.id}`"
        v-model="chk.checked"
      />
      <label :for="`fruit-${chk.id}`">{{ chk.text }}</label>
    </div>

    <p>{{ statusText }}</p>

    <button type="submit">제출</button>
  </form>
</template>
