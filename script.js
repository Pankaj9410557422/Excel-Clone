let defaultProperties={
    text:"",
    "font-weight":"",
    "font-style":"",
    "text-decoration":"",
    "text-align":"left",
    "color":"#000000",
    "background-color":"#ffffff",
    "font-family":"Noto Sans",
    "font-size":"14px",
}

let cellData ={
    "Sheet1":{}
}

let selectedSheet ="Sheet1";
let totalSheets=1;
let lastSheetAdded=1;
$(document).ready(function(){
    for(let i=1;i<=100;i++){
        let ans="";
        let n=i;
        while(n>0){
            let rem=n%26;
            if(rem==0){
                ans+="Z"+ans;
                n= Math.floor(n/26)-1;
            }else{
                ans=String.fromCharCode(rem-1+65)+ans;
                n=Math.floor(n/26);
            }
        } 
        let column = $(`<div class="col-name colId-${i}" address="colCod-${ans}">${ans}</div>`);
        $(".col-container").append(column);
        let row = $(`<div class="row-name" address="rowId-${i}">${i}</div>`);
        $(".row-container").append(row)
    }
    for(let i=1;i<=100;i++){
        let row=$(`<div class="cell-row"></div>`);
        for(let j=1;j<=100;j++){
            let colCode = $(`.colId-${j}`).attr("address").split("-")[1];
            // console.log(colCode);
            let col=$(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colCode}"></div>`);
            row.append(col);
        }
        $(".input-cell-container").append(row);
    }
    $(".align-icon").click(function(){
        $(".align-icon.active").removeClass("active");
        $(this).addClass("active");
    })
    $(".active-style").click(function(){
        $(this).toggleClass("active");
    })

    $(".input-cell").click(function(e){
        if(e.ctrlKey){
            let[rId,cId]=getRowCol(this);
            if(rId>1){
                let topCellSelected=$(`#row-${rId-1}-col-${cId}`).hasClass("active");
                if(topCellSelected){
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rId-1}-col-${cId}`).addClass("bottom-cell-selected")
                }
            }
            if(rId<100){
                let bottomCellSelected=$(`#row-${rId+1}-col-${cId}`).hasClass("active");
                if(bottomCellSelected){
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rId+1}-col-${cId}`).addClass("top-cell-selected")
                }
            }
            if(cId>1){
                let leftCellSelected=$(`#row-${rId}-col-${cId-1}`).hasClass("active");
                if(leftCellSelected){
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rId}-col-${cId-1}`).addClass("right-cell-selected")
                }
            }
            if(cId<100){
                let rightCellSelected=$(`#row-${rId}-col-${cId+1}`).hasClass("active");
                if(rightCellSelected){
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rId}-col-${cId+1}`).addClass("left-cell-selected")
                }
            }
            
        }else{
            $(".input-cell.active").removeClass("active");
        
        }
        $(this).addClass("active");
        updateHeaderProps(this);
    })
    function updateHeaderProps(ele){
        let [rId,cId] = getRowCol(ele);
        let cellInfo = defaultProperties;
        if(cellData[selectedSheet][rId] && cellData[selectedSheet][rId][cId]){
            cellInfo=cellData[selectedSheet][rId][cId];
        }
        cellInfo["font-style"]?$(".icon-italic").addClass("active") : $(".icon-italic").removeClass("active");
        cellInfo["font-weight"]?$(".icon-bold").addClass("active") : $(".icon-bold").removeClass("active");
        cellInfo["text-decoration"]?$(".icon-underline").addClass("active") : $(".icon-underline").removeClass("active");

        let align = cellInfo["text-align"];
        $(".align-icon.active").removeClass("active");
        $(".icon-align-"+align).addClass("active");
        $(".background-color-picker").val(cellInfo["background-color"]);
        $(".text-color-picker").val(cellInfo["color"]);
        $(".font-family-selector").val(cellInfo["font-family"]);
        $(".font-family-selector").css("font-family",cellInfo["font-family"]);
        $(".font-size-selector").val(cellInfo["font-size"]);

    }

    $(".input-cell").dblclick(function(){
        $(".input-cell.active").removeClass("active");
        $(this).addClass("active");
        $(this).attr("contenteditable","true");
        $(this).focus();
    })
    $(".input-cell").blur(function(){
        $(".input-cell.active").attr("contenteditable","false");
        updateCell("text",$(this).text());
    })
    $(".input-cell-container").scroll(function(){
        $(".col-container").scrollLeft(this.scrollLeft);
        $(".row-container").scrollTop(this.scrollTop);
    })
})

function getRowCol(ele){
    let idArr =$(ele).attr("id").split("-");
    let rId=parseInt(idArr[1]);
    let cId=parseInt(idArr[3]);
    return [rId,cId];
}

function updateCell(property,val,defaultPossible){
    $(".input-cell.active").each(function(){
        $(this).css(property,val);
        let [rId,cId] =getRowCol(this);
        if(cellData[selectedSheet][rId]){
            // console.log("hello");
            if(cellData[selectedSheet][rId][cId]){
                cellData[selectedSheet][rId][cId][property]=val;
            }else{
                cellData[selectedSheet][rId][cId]={...defaultProperties};
                cellData[selectedSheet][rId][cId][property]=val;
            }
        }else{
            // console.log("hy");
            cellData[selectedSheet][rId]={};
            cellData[selectedSheet][rId][cId]={...defaultProperties};
            cellData[selectedSheet][rId][cId][property]=val;
        }

        if(defaultPossible && (JSON.stringify(cellData[selectedSheet][rId][cId])===JSON.stringify(defaultProperties))){
            // console.log("inside update");
            delete cellData[selectedSheet][rId][cId];
            if(Object.keys(cellData[selectedSheet][rId]).length == 0){
                delete cellData[selectedSheet][rId];
            }
        }
        
    });
    console.log(cellData);

}
$(".icon-bold").click(function(){
    if($(this).hasClass("active")){
        updateCell("font-weight","",true);
    }else{
        updateCell("font-weight","bold",false);
    }

})
$(".icon-italic").click(function(){
    if($(this).hasClass("active")){
        updateCell("font-style","",true);
    }else{
        updateCell("font-style","italic",false);
    }

})
$(".icon-underline").click(function(){
    if($(this).hasClass("active")){
        updateCell("text-decoration","",true);
    }else{
        updateCell("text-decoration","underline",false);
    }

})
$(".icon-align-left").click(function(){
    if(!$(this).hasClass("active")){
        updateCell("text-align","left",true);
    }
})
$(".icon-align-center").click(function(){
    if(!$(this).hasClass("active")){
        updateCell("text-align","center",true);
    }
})
$(".icon-align-right").click(function(){
    if(!$(this).hasClass("active")){
        updateCell("text-align","right",true);
    }
})
$(".font-family-selector").change(function(){
    updateCell("font-family", $(this).val());
    $(".font-family-selector").css("font-family",$(this).val());
})
$(".font-size-selector").change(function(){
    updateCell("font-size", $(this).val());
})

$(".color-fill-icon").click(function(){
    $(".background-color-picker").click();
})
$(".color-text-icon").click(function(){
    $(".text-color-picker").click();
})

$(".background-color-picker").change(function(){
    updateCell("background-color",$(this).val());
})
$(".text-color-picker").change(function(){
    updateCell("color",$(this).val());
})

function emptySheet(){
    let sheetInfo = cellData[selectedSheet];
    for(let i of Object.keys(sheetInfo)){
        for(let j of Object.keys(sheetInfo[i])){
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color","#ffffff");
            $(`#row-${i}-col-${j}`).css("color","#000000");
            $(`#row-${i}-col-${j}`).css("text-align","left");
            $(`#row-${i}-col-${j}`).css("font-style","");
            $(`#row-${i}-col-${j}`).css("font-weight","");
            $(`#row-${i}-col-${j}`).css("text-decoration","");
            $(`#row-${i}-col-${j}`).css("font-family","Noto Sans");
            $(`#row-${i}-col-${j}`).css("font-size","14px");
        }
    }
}

function loadSheet(){
    let sheetInfo = cellData[selectedSheet];
    for(let i of Object.keys(sheetInfo)){
        for(let j of Object.keys(sheetInfo[i])){
            let cellInfo = cellData[selectedSheet][i][j];
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color",cellInfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color",cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("text-align",cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-style",cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css("font-weight",cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("text-decoration",cellInfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("font-family",cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("font-size",cellInfo["font-size"]);
        }
    }
}

$(".icon-add").click(function(){
    // console.log("hy");
    emptySheet();
    $(".sheet-tab.active").removeClass("active");
    let sheetName= "Sheet"+(lastSheetAdded +1);
    cellData[sheetName]={};
    totalSheets+=1;
    lastSheetAdded+=1;
    selectedSheet=sheetName;
    $(".sheet-tab-container").append(`<div class="sheet-tab active">${sheetName}</div>`);
    $(".sheet-tab.active").click(function(){
        if(!$(this).hasClass("active")){
            selectSheet(this);
        }
    })
})

$(".sheet-tab").click(function(){
    if(!$(this).hasClass("active")){
        selectSheet(this);
    }
})
function selectSheet(ele){
    $(".sheet-tab.active").removeClass("active");
    $(ele).addClass("active");
    emptySheet();
    selectedSheet=$(ele).text();
    loadSheet();
}    