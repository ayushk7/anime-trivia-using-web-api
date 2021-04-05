//req-example = https://opentdb.com/api.php?amount=10&category=31&difficulty=easy&type=multiple
let R = "https://opentdb.com/api.php?amount=10&category=31&difficulty=easy&type=multiple";
let req = new Request(R);



let dist = 0;
let next = document.getElementById("next");
next.addEventListener("click", Submit);
next.addEventListener("click", Next);

function Next() {
    back.style.color = "white";
    if (dist == 8) {
        next.innerHTML = "Submit";
    } else next.innerHTML = "Next";
    questions = document.getElementsByClassName("ques");
    if (dist < 9) {
        dist++;
        for (let i = 0; i < questions.length; i++) {
            questions[i].style.left = `${dist * (-40)}rem`;
        }
    }
}
let back = document.getElementById("back");
back.onclick = function() {
    questions = document.getElementsByClassName("ques");
    if (dist > 0) {
        dist--;
        for (let i = 0; i < questions.length; i++) {
            questions[i].style.left = `${dist * (-40)}rem`;
        }
    }
    if (dist == 9) {
        next.innerHTML = "Submit";
    } else if (dist < 9 && dist >= 0) next.innerHTML = "Next";
    if (dist == 0) {
        back.style.color = "gray";
    }
    console.log(dist);
}
back.style.color = "gray";
back.addEventListener("mouseover", over);
back.addEventListener("mouseout", out);
next.addEventListener("mouseover", over);
next.addEventListener("mouseout", out);

function over() {
    // next.style.fontSize = "1.6rem";
    if (this.style.color != "gray")
        this.style.color = "yellow";
}

function out() {
    if (this.style.color != "gray")
        this.style.color = "white";
}





let getData = fetch(req)
    .then(res => {
        if (res.ok)
            return res.json();
        else throw new Error("error occurred");
    })
    .then(jsonData => jsonData)
    .catch(err => { console.log(err.message) });

function createQuestionTemplate(ques, index) {
    let options = [ques.correct_answer, ques.incorrect_answers[0], ques.incorrect_answers[1], ques.incorrect_answers[2]];
    options.sort();
    let text = `<div class="ques" id="q${index}">
    <p>${ques.question}</p>
    <div class="options">
        <div class="opt"><input type="radio" name="ans${index}" value="${options[0]}" id="a${index}">
            <label for="a${index}">${options[0]}</label>
        </div>
        <div class="opt"><input type="radio" name="ans${index}" value="${options[1]}" id="b${index}">
            <label for="b${index}">${options[1]}</label>
        </div>
        <div class="opt"><input type="radio" name="ans${index}" value="${options[2]}" id="c${index}">
            <label for="c${index}">${options[2]}</label>
        </div>
        <div class="opt">
            <input type="radio" name="ans${index}" value="${options[3]}" id="d${index}">
            <label for="d${index}">${options[3]}</label>
        </div>
    </div></div>`;
    return text;
}


function make(questions) {
    let cont = '';
    for (let i = 0; i < questions.length; i++) {
        cont += createQuestionTemplate(questions[i], i);
    }
    let container = document.querySelector(".questions");
    container.innerHTML = cont;
    questions = document.getElementsByClassName("ques");
    for (let i = 0; i < questions.length; i++) {
        questions[i].style.left = `0rem`;
    }

}



async function run() {
    let data = await getData;
    make(data.results);
    return data.results;
}

let data = {};
run().then(res => { data = res });

function getRadioValue(name) {
    let values = document.getElementsByName(name);
    for (e of values) {
        if (e.checked)
            return e.value;
    }
    return '';
}


function Submit() {
    if (this.innerHTML != "Submit")
        return;
    let count = 0;
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let nam = `ans${i}`;
        let ans = getRadioValue(nam);
        if (ans === data[i].correct_answer)
            count++;
    }
    let time = 0;
    setInterval(upd, 1000);
    document.querySelector(".container").innerHTML = `<p class="msg">Calculating...</p>`;

    function upd() {
        document.querySelector(".container").innerHTML = `<p class="msg">Your Score Is  <strong>${count}/10</strong>.
        <br>Play Again in ${(10000 - time) / 1000}</p>`;
        if (time >= 10000) {
            window.location.reload();
            clearInterval(upd);
        }
        time += 1000;
    }


}