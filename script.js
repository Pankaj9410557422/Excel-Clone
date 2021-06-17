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
            let col=$(`<div class="input-cell" contenteditable="true" id="row-${i}-col-${j}" data="code-${colCode}"></div>`);
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

    $(".input-cell").click(function(){
        $(".input-cell.active").removeClass("active");
        $(this).addClass("active");
    })
})


