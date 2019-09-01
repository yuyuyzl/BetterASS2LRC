function parseASS(){
    var assStr=$("#ass").val();
    var assLines=assStr.substr(assStr.match(/\n\[Events\]/).index+10).split("\n");
    console.log(assLines);
    var keys=assLines[0].substr(7).replace(/ /g,"").split(",");
    console.log(keys);
    var lineObjs=[];
    for(var i=1;i<assLines.length;i++){
        if(assLines[i].startsWith("Dialogue:")){
            var obj={}
            var line=assLines[i].substr(9).trim();
            var values=line.split(",");
            for(var k=0;k<keys.length;k++)obj[keys[k]]=values[k];
            obj["Text"]=values.slice(keys.length-1).join(",");
            lineObjs.push(obj);
        }
    }
    console.log(lineObjs);
    function parseTime(timehmsf){
        var splitted=timehmsf.split(":");
        return ""+(parseInt(splitted[0])*60+parseInt(splitted[1]))+":"+splitted[2];
    }
    var lrcStr="[0:00.00] \n";
    for(var i=0;i<lineObjs.length;i++){
        lrcStr+="["+parseTime(lineObjs[i]["Start"])+"]"+lineObjs[i]["Text"]+"\n["+parseTime(lineObjs[i]["End"])+"]"+" "+"\n";
    }
    $("#lrc").val(lrcStr);

}

function saveLrc(){
    var blob = new Blob([$("#lrc").val()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "converted.lrc");
}

$(function () {
    $("#assInput").change(function () {
        console.log("changed");
        console.log(this.files);
        var reader = new FileReader();//新建一个FileReader
        reader.readAsText(this.files[0], "UTF-8");//读取文件
        reader.onload = function(evt) { //读取完文件之后会回来这里
            var fileString = evt.target.result; // 读取文件内容
            $("#ass").val(fileString);
            parseASS();
        }
    });
});
