// 타입 단언(type assertion)
var ab;
ab = 20;
ab = 'a';
var b=ab as string;

// DOM API 조작
// <div id="app">hi</div>

var div=document.querySelector('div');
if(div){
    div.innerText
}