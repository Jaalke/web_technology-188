function swapRows(rowOne, rowTwo) {
    rowOne = rowOne.replaceWith(rowTwo);
    rowTwo.after(rowOne);
}

function sortTable(id) {

}

$(".header").click(
    function(){
        swapRows($("#testOne"), $("#testTwo"));
    }
);