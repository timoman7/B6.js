//Place alive or dead cells with the left or right mouse button, respectively
//Set mouseMode to "click" to place 1 cell
//Set mouseMode to "drag" to place multiple cells
//Press "a" to save the data of the grid
/**
 * Based on https://en.wikipedia.org/wiki/Conway's_Game_of_Life
**/
var mouseMode="drag";
var GridW=30;
var GridH=30;
var CellColors=[
    color(255, 0, 0),
    color(0,255,0),
    color(0,0,255),
    color(255,255,0),
    color(0,255,255),
    color(255,0,255),
    ];

var saveFile = function(name, data) {
    var a = $("<a style='display: none;'/>");
    var url = data;
    a.attr("href", url);
    a.attr("download", name);
    $("body").append(a);
    a[0].click();
    window.setTimeout(function(){
        window.URL.revokeObjectURL(url);
        a.remove();
    }, 500);
};
var acorn=[[1,4],[2,4],[2,2],[4,3],[5,4],[6,4],[7,4]];
var blockLE=[
    [1,1],
    [2,1],
    [3,1],
    [4,1],
    [5,1],
    [6,1],
    [7,1],
    [8,1],
    [10,1],
    [11,1],
    [12,1],
    [13,1],
    [14,1],
    [18,1],
    [19,1],
    [20,1],
    [27,1],
    [28,1],
    [29,1],
    [30,1],
    [31,1],
    [32,1],
    [33,1],
    [35,1],
    [36,1],
    [37,1],
    [38,1],
    [39,1],
    ];
var offsetShape=function(shape,x,y){
    var tempShape = [];
    for(var i = 0; i < shape.length; i++){
        var tempCoord=[shape[i][0]+x,shape[i][1]+y];
        tempShape.push(tempCoord);
    }
    return tempShape;
};
var mCorn=offsetShape(acorn,15,20);
var starting=[];
var rng=round(random(40,(GridW*GridH)/2));
for(var i=0;i<rng;i++){
    starting.push([round(random(0,GridW-1)),round(random(0,GridH-1))]);
}
var setState=function(civ,x,y,state){
    this.x=x;
    this.y=y;
    this.index=civ.Width * this.y + this.x;
    if(civ.population[this.index].state==="dead"){
        civ.population[this.index].CellColor=CellColors[round(random(0,CellColors.length-1))];
    }
    civ.population[this.index].state=state;
};
stroke(255);
var Cell = function(prnt){
    this.CellColor=CellColors[round(random(0,CellColors.length-1))];
    this.index=0;
    this.prnt=prnt;
    this.state="dead";
    this.nextState="dead";
    this.nb=[];
    this.dn=0;
    this.an=0;
    //prnt.population
    this.checkNB=function(){
        this.an=0;
        this.dn=0;
        this.nb=[];
        var x = this.index % this.prnt.Width;
        var y = (this.index - x) / this.prnt.Width;
        if(x>0){
            var ml = this.prnt.population[this.prnt.Width * y + (x-1)];
            this.nb.push(ml);
        }else{
            this.dn++;
        }
        if(x>0 && y<this.prnt.Height-1){
            var bl = this.prnt.population[this.prnt.Width * (y+1) + (x-1)];
            this.nb.push(bl);
        }else{
            this.dn++;
        }
        if(x > 0 && y > 0){
            var tl = this.prnt.population[this.prnt.Width * (y-1) + (x-1)];
            this.nb.push(tl);
        }else{
            this.dn++;
        }
        if(x<this.prnt.Width-1){
            var mr = this.prnt.population[this.prnt.Width * y + (x+1)];
            this.nb.push(mr);
        }else{
            this.dn++;
        }

        if(x<this.prnt.Width-1 && y<this.prnt.Height-1){
            var br = this.prnt.population[this.prnt.Width * (y+1) + (x+1)];
            this.nb.push(br);
        }else{
            this.dn++;
        }

        if(x<this.prnt.Width-1 && y > 0){
            var tr = this.prnt.population[this.prnt.Width * (y-1) + (x+1)];
            this.nb.push(tr);
        }else{
            this.dn++;
        }

        if(y>0){
            var tm = this.prnt.population[this.prnt.Width * (y-1) + (x)];
            this.nb.push(tm);
        }else{
            this.dn++;
        }

        if(y<this.prnt.Height-1){
            var bm = this.prnt.population[this.prnt.Width * (y+1) + (x)];
            this.nb.push(bm);
        }else{
            this.dn++;
        }
        for(var i = 0; i < this.nb.length; i++){
            if(this.nb[i].state==="dead"){
                this.dn++;
            }
            if(this.nb[i].state==="alive"){
                this.an++;
            }
        }

        if(this.state === "alive"){
            //println(this.an);
            if(this.an > 3 || this.an < 2){
                this.nextState="dead";
            }else{
                this.nextState="alive";
            }
        }else{
            this.aliveRule=3;
            if(this.an === this.aliveRule){
                this.newR=0;
                this.newG=0;
                this.newB=0;
                for(var i = 0; i<this.nb.length;i++){
                    if(this.nb[i].state==="alive"){
                        this.newR+=red(this.nb[i].CellColor);
                        this.newG+=green(this.nb[i].CellColor);
                        this.newB+=blue(this.nb[i].CellColor);
                    }
                }
                this.newR=this.newR/this.aliveRule;
                this.newG=this.newG/this.aliveRule;
                this.newB=this.newB/this.aliveRule;
                this.newColor=color(this.newR,this.newG,this.newB);
                var rng = round(random(0,100));
                if(rng<8){
                    var rng2 = round(random(0,100));
                    if(CellColors.includes(this.newColor)){

                    }else{
                        CellColors.push(this.newColor);
                    }

                    if(rng2<50){
                        this.newColor=CellColors[round(random(0,CellColors.length-1))];
                    }
                }
                //this.newColor=this.CellColor;
                this.CellColor=this.newColor;
                this.nextState="alive";
            }else{
                this.nextState="dead";
            }
        }
    };

};
var Civ=function(Width,Height){
    this.Width=Width;
    this.Height=Height;
    this.population=[];
    this.Started=false;
    this.ExportStats={
        Width:this.Width,
        Height:this.Height,
        Population:[],
        Started:this.Started,
    };
    this.indexSort=function(a,b){
        if(a.index < b.index){
            return -1;
        }
        if(a.index > b.index){
            return 1;
        }
        return 0;
    };
    this.getCellStates=function(){
        this.ExportStats.Population=[];
        for(var i = 0; i < this.population.length; i++){
            this.tempCell=this.population[i];
            this.newCell={nextState:this.tempCell.nextState,state:this.tempCell.state,index:this.tempCell.index};
            this.ExportStats.Population.push(this.newCell);
        }
        this.ExportStats.Population.sort(this.indexSort);
    };
    this.setMode=function(bool){
        this.Started=bool;
    };
    this.returnCiv=function(){
        this.getCellStates();
        this.data=JSON.stringify(this.ExportStats);

        this.url = 'data:text/json;charset=utf8,' + window.encodeURIComponent(this.data);
        saveFile('CGoL_'+round(random(1000,9999))+'.json', this.url);
    };
    this.addCell=function(){
        this.population.push(new Cell(this));
        this.population[this.population.length-1].index=this.population.length-1;
    };
    this.updateCells=function(){
        for(var i = 0;i < this.population.length; i++){
            this.drawCell=this.population[i];
            this.drawCell.checkNB();
        }
    };
    this.finalizeCells=function(){
        for(var i = 0;i < this.population.length; i++){
            this.drawCell=this.population[i];
            this.drawCell.state=this.drawCell.nextState;
            this.drawCell.nextState="dead";
        }
    };
    this.draw = function() {
        for(var i = 0;i < this.population.length;i++){
            this.drawCell=this.population[i];
            var x = this.drawCell.index % this.Width;
            var y = (this.drawCell.index - x) / this.Width;

            if(this.drawCell.state === "dead"){
                fill(0);
            }else {
                fill(this.drawCell.CellColor);
            }
            rect(x*(width/Width),y*(height/Height),width/Width,height/Height);
        }
    };

};
var Grid = new Civ(GridW,GridH);
for(var i = 0; i < Grid.Width*Grid.Height; i++){
    Grid.addCell();
}
var mousePressed=function(){
    if(mouseMode === "click" || mouseMode === "drag"){
        if(mouseButton===37){
            setState(Grid,floor((mouseX/width)*Grid.Width),floor((mouseY/height)*Grid.Height),"alive");
        }else if(mouseButton === 39){
            setState(Grid,floor((mouseX/width)*Grid.Width),floor((mouseY/height)*Grid.Height),"dead");
        }
    }
};
var mouseDragged=function(){
    if(mouseMode === "drag"){
        if(mouseButton===37){
            setState(Grid,floor((mouseX/width)*Grid.Width),floor((mouseY/height)*Grid.Height),"alive");
        }else if(mouseButton === 39){
            setState(Grid,floor((mouseX/width)*Grid.Width),floor((mouseY/height)*Grid.Height),"dead");
        }
    }
};
var placeObject=function(civ,obj){
    for(var i = 0; i < obj.length; i++){
        setState(civ,obj[i][0],obj[i][1],"alive");
    }
};
/*
for(var x = 0; x < GridW; x++){
    for(var y = 0; y < GridH; y++){
        if((x%2===0 && y%2 === 0) || (x%2===1 && y%2 === 1)){
            setState(Grid,x,y,"alive");
        }
    }
}
*/
placeObject(Grid,starting);
frameRate(60);
var keyTyped=function(){
    if(key.toString()===" "){
        Grid.setMode(!Grid.Started);
    }
    if(key.toString()==="a"){
        //Grid.returnCiv();
    }

};
frameRate(10);
draw=function() {
    Grid.draw();
    if(Grid.Started){
        Grid.updateCells();
        Grid.finalizeCells();
        Grid.draw();
    }
    noFill();
    stroke(0,255,0);
    rect(floor((mouseX/width)*Grid.Width)*(width/Grid.Width),floor((mouseY/height)*Grid.Height)*(height/Grid.Height),width/Grid.Width,height/Grid.Height);
    stroke(255);
};
