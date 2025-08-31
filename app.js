const categorySelect = document.getElementById("category");
const button=document.getElementById("btn");
let limit_value=document.querySelector("#limit");
let score=0;
button.addEventListener("click",()=>{
    let topic=  categorySelect.value;
    let limit= limit_value.value;
    generate(topic,limit);

})
const apiKey ="dlddcKWrxKqpcaohMZdK2naUuAiIZ4JNBUsKM1L5"
async function generate(topic,limit){
    try{
        console.log(topic,limit)
 const response= await fetch(`https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=${limit}&category=${topic}`);
    const data= await response.json();
    console.log(data);
        create(data,limit);
    }catch(e){
        alert("No Questions Found")
    }

}

let myMap = new Map();

function create(data,limit) {
  const container = document.getElementById("quiz");
  container.innerHTML = ""; 

  data.forEach(item => {
    const ques = document.createElement("h3");
    ques.textContent = item.question;
    container.appendChild(ques);
   Object.entries(item.correct_answers).forEach(([key, corr])=>{
    if(corr==="true"){
       const answerKey = key.replace("_correct", "");
        myMap.set(item.id, item.answers[answerKey]);
    }
   })
    const optionsList = document.createElement("ul");
    Object.entries(item.answers).forEach(([key, ans]) => {
      if (ans) {
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question${item.id}`; 

        input.id = `${item.id}_${key}`;
        input.value = ans;

        const label = document.createElement("label");
        label.setAttribute("for", input.id);
        label.textContent = ans;

        li.appendChild(input);
        li.appendChild(label);
        optionsList.appendChild(li)
      }
    });
    container.appendChild(optionsList);
  });



  const submit= document.createElement("button");
  submit.innerHTML="Submit";
  container.appendChild(submit);
  submit.disabled=false;

 submit.addEventListener("click", function() {
  quizResult(limit, submit);
});

}
function quizResult(limit,submit){
    
score=0;
myMap.forEach((correctAns, quesId)=>{
    const selected= document.querySelector(`input[name="question${quesId}" ]:checked`);
    if(selected && selected.value===correctAns){
        score++;
    }
})
const scoreContainer= document.querySelector("#score");
 scoreContainer.innerHTML = "";
const scorediv= document.createElement("h2");
scorediv.innerHTML=`Your Score is ${score} out of ${limit}`;

scoreContainer.appendChild(scorediv);
submit.disabled=true;

const attemptAgain= document.createElement("button");
attemptAgain.innerHTML="Start Another Quiz";
scoreContainer.appendChild(attemptAgain);

attemptAgain.addEventListener("click",()=>{
    score = 0;
    myMap.clear();
    input.value = "";
    limit_value.value = "";
    document.getElementById("quiz").innerHTML = "";
    scoreContainer.innerHTML = "";

})

}