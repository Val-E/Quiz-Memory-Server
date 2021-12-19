/* Generates table JSON configuration */
function generate_table(game) {
  document.getElementById("tb").innerHTML="";
  var body = document.getElementById("tb");
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");
  var  m1 = document.getElementById("num1").value;
  var  m2 = document.getElementById("num2").value;
  var  row = document.createElement("tr");

  /* Creates row for the categories */
  if (game == "quiz") {
    let c = 1;
    for (let k = 0; k < m1 * 2; k++) {
      var cell = document.createElement("th"),
          cellContent = document.createElement("input");

      if (k % 2 == 0){
        cellContent.setAttribute("class", "form-control");
        cellContent.setAttribute("type", " text");
        cellContent.setAttribute("name", "category" + c);
        cellContent.setAttribute("placeholder", "Category" + c);
        cell.appendChild(cellContent);
        c++;
      }
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  body.appendChild(tbl);

  /* generates fields for questions and answers */
  let a = 1;
  let q = 1;
  for (let i = 0; i < m2; i++) {
        row = document.createElement("tr");

        for (let j = 0; j < m1 * 2; j++) {
            cell = document.createElement("td");
            cellContent = document.createElement("input")

            cellContent.setAttribute("class", "form-control");
            cellContent.setAttribute("type", " text");
            if(j % 2 == 0) {
                cellContent.setAttribute("name", "question" + q);
                cellContent.setAttribute("placeholder", "Question" + q);
                q++;
            }
            else {
                cellContent.setAttribute("name", "answer" + a);
                cellContent.setAttribute("placeholder", "Answer" + a);
                a++;
            }

            cell.appendChild(cellContent);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);
    tbl.setAttribute("class", "table");
}