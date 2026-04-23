window.addEventListener("load", () => {

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let mode = "Net Load Positif";

// ===== POSISI RUMAH (LAYOUT FIX) =====
let posisi = {
  A:[120,120],
  B:[260,60],
  C:[420,120],
  D:[600,220],
  E:[420,380],
  F:[260,460],
  G:[120,300],
};

// ===== DATA =====
let rumah = {
  A:{d:200,s:150,maxD:500,maxS:800,solar:true},
  B:{d:180,s:0,maxD:400,solar:false},
  C:{d:160,s:0,maxD:350,solar:false},
  D:{d:140,s:0,maxD:300,solar:false},
  E:{d:220,s:200,maxD:500,maxS:800,solar:true},
  F:{d:150,s:0,maxD:300,solar:false},
  G:{d:130,s:0,maxD:250,solar:false},
};

let global = 300;
let maxGlobal = 1500;

let anim = [];
const center = [450,300];

// ===== BUTTON =====
document.getElementById("dayBtn").onclick = ()=>mode="Net Load Positif";
document.getElementById("nightBtn").onclick = ()=>mode="Net Load Negatif";

// ===== ANIMASI =====
function addAnim(target){
  let [tx,ty] = posisi[target];

  anim.push({
    x:center[0],
    y:center[1],
    tx:tx,
    ty:ty,
    step:0
  });
}

// ===== UPDATE =====
function update(){

  for(let k in rumah){
    rumah[k].d = Math.max(0, rumah[k].d - (0.3 + Math.random()*0.8));
  }

  // ===== DAY =====
  if(mode==="day"){
    for(let k in rumah){
      let r = rumah[k];

      if(r.solar){
        let e = 20;

        let toD = Math.min(e, r.maxD - r.d);
        r.d += toD; e -= toD;

        let toS = Math.min(e, r.maxS - r.s);
        r.s += toS; e -= toS;

        if(e>0){
          global = Math.min(maxGlobal, global + e);
        }
      }
    }
  }

  // ===== NIGHT =====
  else {
    let list = Object.keys(rumah)
      .filter(k=>!rumah[k].solar)
      .sort((a,b)=>
        (rumah[a].d/rumah[a].maxD) -
        (rumah[b].d/rumah[b].maxD)
      );

    for(let k of list){
      let r = rumah[k];
      let need = r.maxD - r.d;

      let take = Math.min(r.s, 3, need);
      r.s -= take;
      r.d += take;
      need -= take;

      if(take>0) addAnim(k);

      if(need>0 && global>0){
        let g = Math.min(global, 3, need);
        global -= g;
        r.d += g;

        addAnim(k);
      }
    }
  }

  document.getElementById("status").innerText =
    `Mode: ${mode.toUpperCase()} | Global: ${global}/${maxGlobal}`;
}

// ===== DRAW =====
function draw(){
  ctx.clearRect(0,0,900,600);

  ctx.fillStyle="white";
  ctx.fillText("GLOBAL: "+global+"/"+maxGlobal,20,20);

  // GLOBAL BOX
  ctx.fillStyle="#2b3a67";
  ctx.fillRect(center[0]-40,center[1]-40,80,80);

  ctx.fillStyle="white";
  ctx.fillText(global+"/"+maxGlobal, center[0]-25, center[1]);

  // RUMAH
  for(let k in rumah){
    let r = rumah[k];
    let [x,y] = posisi[k];

    let pct = r.d/r.maxD;
    ctx.fillStyle = pct>0.6 ? "#2ecc71" : pct>0.3 ? "#f1c40f" : "#e74c3c";

    ctx.fillRect(x,y,60,40);

    ctx.fillStyle="white";
    ctx.fillText(k,x+20,y+15);
    ctx.fillText(Math.floor(r.d)+"/"+r.maxD,x+5,y+30);

    if(r.solar){
      ctx.fillText("S:"+Math.floor(r.s)+"/"+r.maxS,x+5,y+45);
    }
  }

  // ANIMASI ⚡
  anim.forEach(a=>{
    a.step++;
    let nx = a.x + (a.tx-a.x)*a.step/20;
    let ny = a.y + (a.ty-a.y)*a.step/20;

    ctx.fillText("⚡",nx,ny);
  });

  anim = anim.filter(a=>a.step<=20);
}

// ===== LOOP =====
setInterval(update,400);
setInterval(draw,60);

});