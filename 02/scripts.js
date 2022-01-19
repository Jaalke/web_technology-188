// helper function for swapping rows in a table, used to sort

function swapRows(rowOne, rowTwo) {
    rowOne.replaceWith(rowTwo);
    rowTwo.after(rowOne);
}

// sorting function using the bubble sort algorithm

function sortTable(table, columnIndex) {
    let rows = table.children("tbody").children();
    let isSorted = false;

    while (!isSorted) {
        isSorted = true;

        for (let i=0; i<rows.length - 1; i++) {
            rows = table.children("tbody").children();
            let firstRow = rows.eq(i);
            let secondRow = rows.eq(i + 1);
            let firstVal = firstRow.children().eq(columnIndex).text();
            let secondVal = secondRow.children().eq(columnIndex).text();

            if (firstVal.localeCompare(secondVal, undefined, { numeric: true }) == 1) {
                swapRows(firstRow, secondRow);
                isSorted = false;
            } 
        }
    }
}

$(".header").click(
    function(){
        sortTable($(this).parents("table"), $(this).index());
    }
);