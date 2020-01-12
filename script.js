def={
  help:"This Program lets you practice skills in transforming binary numbers to their "
     +"decimal representation. After Specifying Difficulty Level you are being given consequently "
     +"tougher binary conversion questions. "
     +"After first fail, quiz finishes and your points are counted , depending on the difficulty of individual numbers and send to High scores.<br> "
     +"<br>List of commands:<br> "
     +"h  ... Help<br> "
     +"hs ... High Scores or Hall Of Fame<br>"
     +"cf ... change font - Go Retro !<br>"
    ,
   font:"Monospace",
   altfont:"PressStart2P",
   curfont:"Monospace",
}




function jsonlog(obj){console.log(JSON.stringify(obj))}
l = (u) => jsonlog(u)
const NOOP= ()=>{};
const isFunction = (x)=>
      Object.prototype.toString.call(x) == '[object Function]';

loggy=document.getElementById("log");


function print(x){
loggy.innerHTML+=x+"<br>";
}

function ask(q,type="text",placeholder="?",ansCB=NOOP){
ob={};
print(q)
ob.input=create("input");
ob.input.type=type;
ob.input.style.fontFamily=def.curfont;
ob.ansCB=ansCB;
ob.input.placeholder = placeholder;

ob.then=function(f){
     ob.ansCB=f
}

ob.andthen=function(f){
     ob.prevAnsCB=ob.ansCB;
     ob.ansCB=function(answer){
          f(ob.prevAnsCB(answer))}
     return ob
}

ob.remove=function(){
   ob.input.removeEventListener("change",ob.onKey,false)
    ob.input.remove()
}

ob.onAns=function(){
    answer=ob.input.value;
      ob.remove();
    ob.ansCB(answer);
     //delete ob;
}

ob.onKey = function(e){
    //console.log(e.key)
    if (e.key == "Enter") ob.onAns();
}

//ob.input.addEventListener("change",ob.onAns,false)
ob.input.addEventListener("keydown",ob.onKey,false)
append(loggy,ob.input)
ob.input.focus();
return ob
}






  function create(element,cN) {
      u=document.createElement(element);
      u.className = cN;
      return u
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }




gridHTML = document.getElementById('grid')


function rnd(min,max){
a=Math.round((Math.random()*(max-min))+min)

return a
}

function makeCheck(num,points,baseQ,baseAns){
   return function(a){
   if (a==num){
       Player.points+=points;
       print("Correct Answer! You have now:"+Player.points+" points.");
       ask("Again? (enter NO to stop quiz) ")
       .then(function(ans){
          if (!(ans.toUpperCase()=="NO")) AskForNum(++QuN);
          else finish();
       })
   }
 
   
   else {
     print("no, you said:"+a+" and answer is:"+num);
     finish();
     }
   }
}

QuN=1;
Player={points:0}

function AskForNum(QuN=0){

baseQ=2;
baseAns=10;

num=rnd(1+QuN,16+(diffic+1)*QuN)

//a=parseInt("1010011",2)
a=num.toString(2);
points=Math.pow(10,a.length-2);
console.log(points);
print("Question "+QuN+". (for "+points+" points)")

check=makeCheck(num,points);

question= "Give representation of<br>"
    +a+"(base "+baseQ
    +") in base "+baseAns;

ask(question,"tel")
.then(check)
}

diffic=2
function askDiffic(){
   ask("Choose Difficulty (1 to 999999) ?  (-h for Help)","tel")
   .then(getCommand)
}

function getCommand(a,CB=askDiffic){
      switch (a){
        case "h":
          print(def.help)
          CB();
          break;
        case "cf":
          def.curfont=def.altfont; 
          loggy.style.fontFamily=def.curfont
          def.altfont=def.font
          CB();
          break;
        default:
          if (!isNaN(a) && a>0){
          diffic=a;
          AskForNum(QuN)
        }
          else{
            print('\"'+a+'\" is not recognized as an internal or external command, operable program or batch file.');
            askDiffic();
            break;
          }
          
      }
      
   }

function finish(){
    print("Congratulations! You Have Won "+Player.points+" points!")
    ask("Please Enter Your Name to Enter Hall Of Fame!! ( i mean save your high score)")
    .then(function(name){
        fetch("addHighScore.php?name="+name+"&score="+Player.points);
    })
}




print("<h1>press TAB key if cursor is not visible.</h1>")
askDiffic()
