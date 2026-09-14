function ValidateAndAdd(){
    var Newword = document.forms["myform"]["newWord"].value;
    var Newnumber = document.forms["myform"]["newNumber"].value;
    if ((Newword) == "") {
        alert("Please enter a word");
        return false;
    }
    else if ((Newnumber != 1) && (Newnumber != 2)) {
        alert("Please enter a 1 or 2");
        document.forms["myform"]["newNumber"].value = "";
        return false;
    }
    else {
        if (Newnumber == 1) {
        var tableRef = document.getElementById("myList1");
        (tableRef.insertRow(tableRef.rows.length)).innerHTML = Newword;}
        else {
        var tableRef = document.getElementById("myList2");
        (tableRef.insertRow(tableRef.rows.length)).innerHTML = Newword;}
        document.forms["myform"]["newWord"].value = "";
        document.forms["myform"]["newNumber"].value = "";
        return true;
    }
}
function ClearList1(){
    var tableRef = document.getElementById("myList1");
    tableRef.innerHTML = "";
}
function ClearList2(){
    var tableRef = document.getElementById("myList2");
    tableRef.innerHTML = "";
}