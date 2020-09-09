const DEFAULT_SIZE = 30;
const LENGTH = 400; // overall dimensions of grid
let length; // length of each cell
const mainBlock = document.querySelector("main");
const clearButton = document.querySelector("#clear");
const selectButton = document.querySelector("#select");
const tempButton = document.querySelector("#temp");
const permButton = document.querySelector("#perm");

let drawType = "perm";
addGrid();
addBtnListeners();

function clearGrid() {
    let drawingGrid = document.getElementById("drawing-grid");
    console.log(drawingGrid);
    mainBlock.removeChild(drawingGrid);
}

function addGrid(size=DEFAULT_SIZE) {
    let grid = createGrid(size);
    mainBlock.appendChild(grid);
}


function createGrid(size=DEFAULT_SIZE) {
    length = Math.floor(LENGTH / size);
    length = `${length}px`;
    console.log(length);
    let grid = document.createElement("div");
    grid.id = "drawing-grid";
    grid.style.margin = "0px auto";
    for (let i = 0; i < size; i++) {
        // create row
        grid.appendChild(createRow(size));
    }
    return grid;
}

function createRow(size) {
    let row = document.createElement("div");
    row.style.float = "left;"
    row.style.lineHeight = "0px";
    row.style.marginBottom = "-1px";
    for (let i = 0; i < size; i++) {
        row.appendChild(createCell());
    }
    return row;
}

function createCell() {
    let gridCell = document.createElement("div");
    gridCell.style.width = length;
    gridCell.style.height = length;
    gridCell.style.border = "solid";
    gridCell.style.borderWidth = "1px";
    gridCell.style.marginLeft = "-1px";
    /*
    gridCell.style.borderTopWidth = "1px";
    gridCell.style.borderLeftWidth = "1px";
    gridCell.style.borderBottomWidth = "0px";
    gridCell.style.borderRightWidth = "0px";
    
    */
    gridCell.style.display = "inline-block";
    if (drawType === "temp") {
        console.log("temp reached")
        // create custom attribute, allowing us to store the timeout function
        // This allows us to clearTimeout in future
        // When we leave a grid cell, and re-enter it, we would want to disable the timeout function for that cell.
        let timeoutAttribute = document.createAttribute("data-timeout");
        gridCell.setAttributeNode(timeoutAttribute);
        gridCell.addEventListener("mouseenter", tempColorCell);
        gridCell.addEventListener("mouseleave", tempClearCell);
    } else if (drawType === "perm") {
        console.log("perm reached");
        gridCell.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        gridCell.addEventListener("mouseenter", permColorCell);
    }
    
    
    return gridCell;
}

function tempColorCell(e) {
    clearTimeout(this.getAttribute("data-timeout"));
    this.classList.add("grid-cell-hover");
}

function tempClearCell(e) {
    let timeoutFunction = setTimeout(()=>this.classList.remove("grid-cell-hover"), 500);
    this.setAttribute("data-timeout", timeoutFunction);
}

function permColorCell(e) {
    let style = window.getComputedStyle(this);
    let bgColor = style.getPropertyValue("background-color");
    console.log(bgColor);
    this.style.backgroundColor = blacken(bgColor);
}

function addBtnListeners() {
    clearButton.addEventListener("click", clearBtnListener);
    selectButton.addEventListener("click", selectBtnListener)
    tempButton.addEventListener("click", tempBtnListener);
    permButton.addEventListener("click", permBtnListener);
}

function clearBtnListener(e) {
    clearGrid();
    addGrid();
}

function selectBtnListener(e) {
    clearGrid();
    let size = prompt("How many cells per row?");
    addGrid(size);
}

function tempBtnListener(e) {
    clearGrid();
    drawType = "temp";
    addGrid();
}

function permBtnListener(e) {
    clearGrid();
    drawType = "perm";
    addGrid();
}



function blacken(colorString) {
    colorString = colorString.substring(colorString.indexOf("(") + 1, colorString.length)
        .split(",");
    red = parseInt(colorString[0]);
    blue = parseInt(colorString[1]);
    green = parseInt(colorString[2]);
    opacity = parseFloat(colorString[3]);
    if (opacity < 1) {
        opacity = Math.min(1, opacity + 0.1);
    }
    return `rgba(${red},${blue},${green},${opacity})`;
}