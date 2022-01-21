// helper function for swapping rows in a table, used to sort:

function swapRows(rowOne, rowTwo) {
    rowOne.replaceWith(rowTwo);
    rowTwo.after(rowOne);
    return;
}

// helper function for restoring the input row to the bottom of the table:
// not exactly elegant but does the job ¯\_(ツ)_/¯

function inputRowToBottom (table) {
    let body = table.children("tbody");
    body.after(body.children(".inputRow"));
}

// sorting function using the bubble sort algorithm:

function sortTable(table, columnIndex, reversed, recursive = true) {

    let rows = table.children("tbody").children();
    let isSorted = false;
    let numberOfChanges = 0;
    let d = 1;

    if (reversed) {
        d = -1;
    }

    while (!isSorted) {
        isSorted = true;

        for (let i=0; i<rows.length - 1; i++) {
            rows = table.children("tbody").children();
            let firstRow = rows.eq(i);
            let secondRow = rows.eq(i + 1);
            let firstVal = firstRow.children().eq(columnIndex).text();
            let secondVal = secondRow.children().eq(columnIndex).text();

            if (firstVal.localeCompare(secondVal, undefined, { numeric: true }) == d) {
                swapRows(firstRow, secondRow);
                isSorted = false;
                numberOfChanges++;
            }
        }
    }

    // the code below automatically sorts in the opposite direction
    // if the table is already sorted

    if (numberOfChanges == 0 && recursive) {
        sortTable(table, columnIndex, !reversed, false);
    }

    return;
}

// refresh function, inserts ALL data from the server into the product table:

function refreshTable(table, data) {

    for (i in data) {
        let lastRow = table.children("tbody").children();
        lastRow = lastRow.eq(lastRow.length - 2)

        let insert = "";
        insert += "<tr>"
        insert += "<td>" + data[i].brand + "</td>";
        insert += "<td>" + data[i].model + "</td>";
        insert += "<td>" + data[i].os + "</td>";
        insert += "<td>" + data[i].screensize + "</td>";
        insert += "<td><a href=\"" + data[i].image + "\">link</a></td>";
        insert += "</tr>";

        lastRow.before(insert);
    }

    return;
}

// listeners:

$("th").click(
    function(){
        sortTable($(this).parents("table"), $(this).index(), false);
        inputRowToBottom($(this).parents("table"));
        $(this).siblings().css("background-color", "black");
        $(this).siblings().css("color", "white");
        $(this).css("background-color", "white");
        $(this).css("color", "black");
    }
);

$("#productTable").ready( 
    function(){
        $.get("https://wt.ops.labs.vu.nl/api22/6fa3add2", function(data, status){
            // alert("Data: " + data + "\nStatus: " + status);
            refreshTable($("#productTable"), data);
        });
    }
);

// <b id="sortingIndicator">&#8681;</b> this could be the sorting indicator
// idk