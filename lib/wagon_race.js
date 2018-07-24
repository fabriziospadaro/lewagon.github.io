let diff = 1;
let score = 0;
function RunGame(difficulty){

var body = document.getElementById('difficulty');
body.innerHTML = "Lev: "+ difficulty;

let field = [];
let rows = 8;
let columns = 12;
let path_to_retrace;

let tbl = document.createElement('table');
tbl.className = "racer_table";

let tbdy = document.createElement('tbody');
var body = document.getElementById('center');

function GenerateField(){
    for(let x = 0 ; x < rows; x++){
        let tr = document.createElement('tr',);
        tr.setAttribute("id","row");
        for(let y = 0 ; y < columns; y++){
            let td = document.createElement('td');
            tr.appendChild(td);
            }
            tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
        body.appendChild(tbl)
}

GenerateField();

class Point2D{
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  function distance(pointA,pointB){
    let horizontal = Math.abs(pointA.x-pointB.x);
    let vertical = Math.abs(pointA.y-pointB.y);

    let sum = horizontal+vertical;
    return horizontal + vertical;
}

class FieldSlot{
    constructor(x,y,html) {
      this.enable = false;
      this.uneditable = false;
      this.x = x;
      this.y = y;
      this.html = html;
      this.require_one_connection = false;
    }

    Require_one_connection(){
        this.require_one_connection = true;
    }

    neighbors(rule){
        let count = 0;

        for(let x = (this.x - 1) ; x-1 < (this.x + 1) ; x++){
            for(let y = (this.y - 1) ; y-1 < (this.y + 1) ; y++){
                let l_distance = distance(new Point2D(x,y),new Point2D(this.x,this.y));
                if(x < 0 || y < 0 || x + 1 > columns || y + 1 > rows || (x === this.x && y === this.y))
                    continue;
                else if(l_distance===rule && field[x][y].isEnabled()){
                    count++;
                }
            }
        }
       return count;
    }
    toggle() {
        console.clear();
        let nearby1 = this.neighbors(1);
        let nearby2 = this.neighbors(2);
        if(this.enable && !this.uneditable){
            this.enable = !this.enable;
            this.html.classList.toggle("field-grass");
            this.html.classList.toggle("field-dirt");
        }
        else{
            if(!this.uneditable && nearby1 > 0 ){
                this.enable = !this.enable;
                this.html.classList.toggle("field-grass");
                this.html.classList.toggle("field-dirt");
            }
        }

    }

    isEnabled(){
        return this.enable;
    }

    setField(){
        this.html.classList.add("field-grass");
    }

    addListener(){
        this.html.addEventListener("mousedown", (event) => {
            this.toggle();
        });

    }

    setUneditableDirt(){
        this.uneditable = true;
        this.enable = true;
        this.html.classList.remove("field-grass");
        this.html.classList.add("field-dirt");
        this.html.classList.add("uneditable");
    }

    resetCell(){
        this.html.classList.remove("uneditable");
    }
    AddObject(type,isobstacle){
        this.uneditable = true;

        if(isobstacle){
            this.enable = false;
            let rotation = type=="water.gif"? 0 : Math.floor((Math.random() * 360));
            let radious = type=="water.gif"? (10 + Math.floor((Math.random() * 12))) : 0;

            this.html.innerHTML += `<img class="obstacle" src="images/Obstacles/${type}" style = "transform: rotate(${rotation}deg); border-radius: ${radious}px";></img>`;

        }else{
            this.html.innerHTML += `<img id="${type}"></img>`;
            this.enable = true;
        }
    }

    RemoveObject(){
        this.html.innerHTML = `<td class="field-dirt"></td>`;
    }
  }


let fieldtdarray = document.querySelectorAll("#row td");


let index = 0;

for(let x = 0 ; x < columns; x++){
    field[x] = [];
    for(let y = 0 ; y < rows; y++){
        field[x][y] = new FieldSlot(x,y,fieldtdarray[x+(y*columns)]);
        field[x][y].setField();
        field[x][y].addListener();
    }
}


let obstacle_paths = [];
let uneditable_tracks = [];
let uneditable_obstacles = [];

obstacle_paths.push("oil.png");
obstacle_paths.push("rock1.png");
obstacle_paths.push("rock2.png");
obstacle_paths.push("rock3.png");
obstacle_paths.push("tree_large.png");
obstacle_paths.push("tree_small.png");
obstacle_paths.push("water.gif");

function Random(min,max){
  return Math.floor(min+(Math.random() * (max-min)));
}

for(let i=0;i<2+(diff*2);i++){
    //devono avere sitanza minima di 3
    let point = new Point2D(Random(1,columns-1),Random(1,rows-1));
    let validpoint = false;

    while (!validpoint) {
        point = new Point2D(Random(1,columns-1),Random(1,rows-1));
        validpoint = true;
        for(let j =0; j<i;j++){
            if(distance(point,uneditable_tracks[j])<3){
                validpoint = false;
                break;
            }
        }
    }
    uneditable_tracks[i] = point;
}


for(let i=0;i<1+(diff*2);i++){
    //devono avere sitanza minima di 3
    let point = new Point2D(Math.floor((Math.random() * columns)),Math.floor((Math.random() * rows)));
    let validpoint = false;

    while (!validpoint) {
        point = new Point2D(Math.floor((Math.random() * columns)),Math.floor((Math.random() * rows)));
        validpoint = true;
        for(let j =0; j<uneditable_tracks.length;j++){
            if(distance(point,uneditable_tracks[j])<2){
                validpoint = false;
                break;
            }
        }
        for(let j =0; j<i;j++){
            if(distance(point,uneditable_obstacles[j])<1){
                validpoint = false;
                break;
            }
        }
    }
    uneditable_obstacles[i] = point;
}



index = 0;
uneditable_tracks.forEach((point)=>{
    if(index === 0){
        field[point.x][point.y].AddObject("start-sprite",false);
        field[point.x][point.y].Require_one_connection();
    }
    else if(index === 1){
        field[point.x][point.y].AddObject("finish-sprite",false);
        field[point.x][point.y].Require_one_connection();
    }
    else
        field[point.x][point.y].setUneditableDirt();
    index++;
});


uneditable_obstacles.forEach((point)=>{
    field[point.x][point.y].AddObject(obstacle_paths[Math.floor(Math.random() * obstacle_paths.length)],true);
});



document.getElementById("start").addEventListener("click", (event) => {
    CheckPathSucess();
});

let intervallll;
function CheckPathSucess(){
    let outcome = true;

    for(let x = 0 ; x < columns; x++){
        for(let y = 0 ; y < rows; y++){
            if(field[x][y].isEnabled()){
                if(field[x][y].require_one_connection){
                    if(!(field[x][y].neighbors(1) === 1))
                        outcome = false;
                }
                else if(field[x][y].neighbors(1) > 2 || field[x][y].neighbors(1) <= 1 )
                    outcome = false;
            }
        }
    }
    if(outcome === true){
        path_to_retrace = retracePath();
        score += path_to_retrace.length*50;
        var body = document.getElementById('score');
        body.innerHTML = "Score: " + score;
        intervallll = setInterval(move,100);
    }
    else
        window.alert("The path is not valid!");

}

function retracePath(){
    let currpoint =  new Point2D(uneditable_tracks[0].x, uneditable_tracks[0].y);
    let open_nodes = [];
    let closed_nodes = [];


    for(let x = 0 ; x < columns; x++){
        for(let y = 0 ; y < rows; y++){
            if(field[x][y].isEnabled()){
                open_nodes.push(new Point2D(x,y));
            }
        }
    }

    closed_nodes.push(currpoint);
    open_nodes.removeV(currpoint);

    do{
        let closer = FindCloser(closed_nodes[closed_nodes.length-1],open_nodes);
        open_nodes.removeV(closer);
        closed_nodes.push(closer);
    }while(open_nodes.length>0);

    closed_nodes.splice(0,1);
    return closed_nodes;

}

let lastpos = new Point2D(uneditable_tracks[0].x, uneditable_tracks[0].y);;
function move(){
    if(path_to_retrace.length > 0){
        if(!field[path_to_retrace[0].x][path_to_retrace[0].y].require_one_connection){
            field[path_to_retrace[0].x][path_to_retrace[0].y].resetCell();
            field[path_to_retrace[0].x][path_to_retrace[0].y].AddObject("start-sprite",false);
        }
        if(path_to_retrace.length>1)
            field[lastpos.x][lastpos.y].RemoveObject();

        lastpos = path_to_retrace[0];

        path_to_retrace.splice(0,1);
    }else{
      clearInterval(intervallll);
      tbl.parentNode.removeChild(tbl);
      diff++;
      RunGame(diff);
    }
}


function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

Array.prototype.removeV = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function FindCloser(point,collection){
    let min_dist = 99999;
    let best_ptn = point;
    collection.forEach((ptn)=>{
        let curr_dist = distance(ptn,point);
        if(curr_dist<min_dist){
            best_ptn = ptn;
            min_dist = curr_dist;
        }
    });

    return best_ptn;

}
}


RunGame(diff);
