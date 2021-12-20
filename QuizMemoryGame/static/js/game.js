function game() {
  round_count = 0;
  question = "";
  answer = "";
  team_num = parseInt(document.getElementById("teams_num").value);

  if (team_num < 2 || isNaN(team_num)) {
   window.alert("add teams/players");
   return;
  }

  teams = [];
  t = 0;
  for (var i = 0; i < team_num; i++) {
    teams.push(0);
  }

  teams_length = teams.length;
  json = document.getElementById('json').value.split(";;;").map(json => json.split("===")).reduce((accumulator, [key, value]) => ({
    ...accumulator,
    [key.trim()]: decodeURIComponent(value)
  }), {});
  m1 = json.num1;
  m2 = json.num2;

  if ((m1 * m2) % teams_length != 0) {
    window.alert("The number of your Questions and teams/players do not match!");
    return;
  }

  document.getElementById("game_name").innerHTML = json["game_id"];
  document.getElementById("tb").innerHTML = "";

  var body = document.getElementById("tb");
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");
  var row = document.createElement("tr");
  if (json.game_type == "quiz") {
    quiz(teams, body, tbl, tblBody, row);
    return;
  }
  if (json.game_type == "memory") {
    memory(teams, body, tbl, tblBody, row, m1, m2);
    return;
  }
}


function memory(teams, body, tbl, tblBody, row) {
  id_list = []
  for (var i = 0; i < m1 * m2; i++) {
    id_list.push(i + 1);
  }
  id_list.sort(() => Math.random() - 0.5);

  question = "";
  answer = "";

  id = 0;
  tblBody.appendChild(row);
  body.appendChild(tbl);

  var q = 1;
  for (var i = 0; i < m2; i++) {
    row = document.createElement("tr");
    for (var j = 0; j < m1; j++) {
      cell = document.createElement("td");
      var cell = document.createElement("th");
      var cellContent = document.createElement("div");
      cellContent.innerHTML = "<button class='btn btn-light' onclick='setQ(" + id_list[(q - 1)] + ")'>" + "Question" + q + "</button>";
      cellContent.setAttribute("id", "question" + id_list[(q - 1)]);
      q++;
      cell.appendChild(cellContent);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  tbl.appendChild(tblBody);
  tbl.setAttribute("class", "table");
  id_list.sort(() => Math.random() - 0.5);
  tblBody.appendChild(row);
  body.appendChild(tbl);

  q = 1;
  for (var i = 0; i < m2; i++) {
    row = document.createElement("tr");
    for (var j = 0; j < m1; j++) {
      cell = document.createElement("td");
      var cell = document.createElement("th");
      var cellContent = document.createElement("div");
      cellContent.innerHTML = "<button class='btn btn-light' onclick='setA(" + id_list[(q - 1)] + ")'>" + "Answer" + q + "</button>"
      cellContent.setAttribute("id", "answer" + id_list[(q - 1)]);
      q++;
      cell.appendChild(cellContent);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  tbl.appendChild(tblBody);
  tbl.setAttribute("class", "table");
}


function quiz(teams, body, tbl, tblBody, row) {
  tblBody.appendChild(row);
  body.appendChild(tbl);

  var c = 1;
  for (var k = 0; k < m1; k++) {
    var cell = document.createElement("th");
    var cellContent = document.createElement("button");
    cellContent.setAttribute("class", " btn btn-info");
    cellContent.innerHTML = json["category" + c];
    cell.appendChild(cellContent);
    c++;
    row.appendChild(cell);
  }
  tblBody.appendChild(row);
  body.appendChild(tbl);

  var q = 1;
  for (var i = 0; i < m2; i++) {
    row = document.createElement("tr");
    for (var j = 0; j < m1; j++) {
      cell = document.createElement("td");
      var cell = document.createElement("th");
      var cellContent = document.createElement("div");
      cellContent.innerHTML = "<button class='btn btn-light' onclick='setQuestion(" + q + ")'>" + "Question" + q + "</button>"
      cellContent.setAttribute("id", "question" + q);
      q++;
      cell.appendChild(cellContent);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  tbl.appendChild(tblBody);
  tbl.setAttribute("class", "table");
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function setA(i) {
  if (answer == "") {
    document.getElementById("answer_container").innerHTML = "<h4 class='h4'>Answer:</h4>" + "<h6 class='h6'>" + json["answer" + i] + "</h6>";
    answer = json["answer" + i];
    if (question == "") {
      id = i;
      return;
    }
    else {
      checkCard(i);
    }
  }
}


/* set Question */
function setQ(i) {
  if (question == "") {
     document.getElementById("question_container").innerHTML = "<h4 class='h4'>Question:</h4>" + "<h6 class='h6'>" + json["question" + i] + "</h6>";
     question = json["answer" + i];

     if (answer == "") {
        id = i;
        return;
     }
     else {
       checkCard(i);
     }
  }
}



/* check if guess is correct */
function checkCard(i) {
  if (t == teams_length) {
    t = 0;
  }
  if (id == i) {
    sleep(3000).then(() => {
      document.getElementById("answer_container").innerHTML = "";
      document.getElementById("question_container").innerHTML = "<div class='alert alert-success' role='alert'>" + "Correct!" + "</div>";
      teams[t] += 1;
      document.getElementById("answer" + i).innerHTML = "";
      document.getElementById("question" + i).innerHTML = "";
      round_count++;
      checkEnd();
      answer = "";
      question = "";
    });
  }
  else {
    sleep(3000).then(() => {
      document.getElementById("answer_container").innerHTML = "";
      document.getElementById("question_container").innerHTML = "<div class='alert alert-danger' role='alert'>" + "Wrong!" + "</div>";
        answer = "";
        question = "";
    });
    t++;
  }
}


function setQuestion(q) {
  if (question != "") {
    return;
  }
  question = json["question" + q];
  answer = json["answer" + q];
  document.getElementById("question" + q).innerHTML = "";
  document.getElementById("question_container").innerHTML = "<h4 class='h4'>Question:</h4>" + "<h5 id='question' class='h5'>" + question + "</h5>";
  document.getElementById("answer_container").innerHTML = "<h6 class='h6'>" + "Answer:" + "<input value='Your answer' type='text' id='answer'>" + "<button class='btn btn-danger' onclick='check()' type='button'>Submit</button>" + "</h6>";
}


function check() {
  if (question == "") {
    return;
  }
  if (t == teams_length) {
    t = 0;
  }
  user_answer = document.getElementById("answer").value;
  if (user_answer === answer) {
    document.getElementById("question_container").innerHTML = "<div class='alert alert-success' role='alert'>" + "Correct!" + "</div>";
    teams[t] += 1;
  }
  else {
    document.getElementById("question_container").innerHTML = "<div class='alert alert-danger' role='alert'>" + 'Wrong, the correct answer would be:"' + answer + '"' + "</div>";
    teams[t] += -1;
  }
  round_count++;
  checkEnd();
  t++;
  question = "";
}


function checkEnd() {
  if (round_count >= json['num1'] * json['num2']) {
    document.getElementById("answer_container").innerHTML = "";
	document.getElementById("question_container").innerHTML = "";

    score = "<h4 class='h4'>Results:</h4>";
    for (var i = 0; i < teams_length; i++) {
      score += "<h6 class='h6'> Team/Player" + (i + 1) + ": " + teams[i] + "</h6>";
    }
    document.getElementById("tb").innerHTML = score;
  }
}
