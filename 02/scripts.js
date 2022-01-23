// helper function for swapping rows in a table:

function swapRows(rowOne, rowTwo) {
    rowOne.replaceWith(rowTwo);
    rowTwo.after(rowOne);
    return;
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
            rows = table.children("tbody").children().not(".inputRow");
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

// table content refresh, WIPES the table and inserts ALL data from the server:

function refreshProductTable(table, data) {

    table.children("tbody").children().not(".inputRow").remove();

    for (i in data) {
        let lastRow = table.children("tbody").children();
        lastRow = lastRow.eq(lastRow.length - 1);

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

$("#productTable").ready( 
    function(){
        $.get("https://wt.ops.labs.vu.nl/api22/6fa3add2", function(download){
            refreshProductTable($("#productTable"), download);
        });
    }
);

$("th").click(
    function(){
        sortTable($(this).parents("table"), $(this).index(), false);
        $(this).siblings().css("background-color", "black");
        $(this).siblings().css("color", "white");
        $(this).css("background-color", "white");
        $(this).css("color", "black");
    }
);

$("form").submit(
    function(event){

        event.preventDefault();
        let form = $(this);
        let upload = form.serialize();

        $.post("https://wt.ops.labs.vu.nl/api22/6fa3add2", upload, function() {
            $.get("https://wt.ops.labs.vu.nl/api22/6fa3add2", function(download){
                refreshProductTable($("#productTable"), download);
            });
        });
    }
);