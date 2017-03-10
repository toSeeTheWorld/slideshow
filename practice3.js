//offset:偏移量(页宽X页数)
//interval:最小定时间隔
//time:每切一图的时间
//speed:每定时周期偏移量speed=offset/(time/interval)	此处speed必须为整数，否则会有误差累积
//timer:超时调用ID，用于取消超时调用的自动播放
//animated:动画运行中标志，开始时设true，结束设false
//index:按钮或页面的索引
//buttons:按钮数组
//picList:图片列表ul
//newLeft:移动后应到达的位置
//direction:值为nextBtn或prevBtn，模拟不同按钮切换播放顺序
//loop:循环与否标志，值为true，false

var timer;
var animated = false;
var index = 1;
var prevBtn = document.getElementById("prev");
var nextBtn = document.getElementById("next");
var playBtn = document.getElementById("play");
var stopBtn = document.getElementById("stop");
var fastBtn = document.getElementById("fast");
var slowBtn = document.getElementById("slow");
var loopBtn = document.getElementById("loop");
var directionBtn = document.getElementById("direction");
var picList = document.getElementById("pic-list");
var btns = document.getElementById("circle-btns").getElementsByTagName("span");

/////////////播放函数//////////////D

function animate(offset){
	var time = 400;							//time:每切一图的时间
	var interval = 10;						//interval:最小定时间隔	
	var speed = offset/(time/interval);		//speed:每定时周期偏移量
	var newLeft = parseInt(picList.style.left) + offset;	//移动后应到达的位置
	function go(){
		animated = true;					//动画开始
		//判断条件(列表右移且未到达预定位置 || 列表左移且未到达预定位置)
		if ((speed > 0 && parseInt(picList.style.left) < newLeft) || speed < 0 && parseInt(picList.style.left) > newLeft) {
			picList.style.left = parseInt(picList.style.left) + speed + "px";
			setTimeout(arguments.callee, interval);		//递归直到到达预定位置
		} else{   //到达预定位置后判断时候需要跳转
			picList.style.left = newLeft + "px";
			if (newLeft > -800) {
				picList.style.left = -3200 + "px";
			} else if (newLeft < -3200) {
				picList.style.left = -800 + "px";
			}
			animated = false;					//动画结束(不能写在后面那个括号外)
		}
		
	}
	go();  //调用函数
}

/////////////上下页点击事件////////B

nextBtn.onclick = function(){
	if (animated) {
		return;			//动画执行中，不执行点击事件
	}
	animate(-800);
	if (index == 4) {
		index = 1;		
	} else{
		index += 1;		//设置变化后的按钮索引
	}
	changeBtn();		//按钮对应切换
}
prev.onclick = function(){
	if (animated) {
		return;
	}
	animate(800);
	if (index == 1) {
		index = 4;
	} else{
		index -= 1;
	}
	changeBtn();
}

/////////////按钮切换//////////////C

for (var i = 0; i < btns.length; i++) {
	btns[i].onclick = function(){
		if (animated) {
			return;
		}
		var newIndex = parseInt(this.getAttribute("data-index"));//被点击按钮的索引值
		var offset = -800*(newIndex - index);		//根据索引值差计算偏移量
		animate(offset);
		index = newIndex;	
		changeBtn();			//更新样式
	}
}

function changeBtn(){		//更新按钮样式函数
	for (var i = 0; i < btns.length; i++) {
		if (btns[i].className == "on") {
			btns[i].className = " ";	//遍历将原先类名去掉
			break;
		}
	}
	btns[index - 1].className = "on";	//设置新的on类名
}

/////////////播放方向切换//////////E

var direction = nextBtn;	//初始化方向
directionBtn.onclick = function(){ //点击改变方向
	if (direction == nextBtn) {
		direction = prevBtn;
	} else{
		direction = nextBtn;
	}
}

/////////////播放间隔设置//////////F

var waitTime = 3000;
fastBtn.onclick = function(){
	waitTime -= 500;
}
slowBtn.onclick = function(){
	waitTime += 500;
}

/////////////循环与否//////////////G

var loop = true;
loopBtn.onclick = function(){	
	loop = !loop;				//每次点击更改循环与否
	stopOrLoop();				//进入循环停止判断函数
}

function stopOrLoop(){	
	if (loop) {					
		clearTimeout(timer2);	//再次启动循环时，清除不循环时的定时器timer2
		play();					//播放
	} else{						//不循环时
		timer2 = setTimeout(function(){		//不循环时，监听是否到达目标位置
			if ((direction == nextBtn && index == 4) || (direction == prevBtn && index == 1)) {  //(列表左移且到最后一图)||(列表右移且到最前一图)
				stop();				//到达目标位置后再停止循环
				clearTimeout(timer2);	//停止后取消定时器监听位置
			}
			stopOrLoop();			//未到达目标位置时持续回调
		},1000);
	}
}

/////////////play&stop/////////////A

function play(){
	timer = setTimeout(function(){
		direction.onclick();      //自动触发上下页点击事件(如果不改变方向，direction改为nextBtn即可)
		play();
	},waitTime)     //播放间隔(无需设置取3000就好)
}
function stop(){
	clearTimeout(timer);
}

playBtn.onclick = picList.onmouseout = play;
stopBtn.onclick = picList.onmouseover = stop;

play();

