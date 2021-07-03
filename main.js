var urlpre;
var urlsuf = '.jpg';
var urlsufMob1 = ".jpg?x-oss-process=image/crop,x_0,y_0,w_1570,h_2255"
var urlsufMob2 = ".jpg?x-oss-process=image/crop,x_1500,y_0,w_1570,h_2255"

var img1 = document.getElementById('img1');
var preLoadNum = 3;
var pageNum = 1;
var numPages;
var isPc = null;

function getId( url ) {
        var re = new RegExp( url + "=([^\&]*)", "i" );
        var a = re.exec( document.location.search );
        if ( a == null )
            return null;
        return a[1];
}
var bookId = getId("bookId");

if (bookId == 1) {
	urlpre = '//class9.oss-cn-hongkong.aliyuncs.com/ClassDiaryOnline/resources/book1/';
	document.getElementById('header').textContent = "玖班班级日志<一>"
	numPages = 2;
} else {
	urlpre = '//class9.oss-cn-hongkong.aliyuncs.com/ClassDiaryOnline/resources/book2/';
	document.getElementById('header').textContent = "玖班班级日志<二>"
	numPages = 2;
}

function GetPageURL(page) {
	if (isPc) {
		return urlpre + page + urlsuf;
	} else if (page % 2 == 1) {
		return urlpre + Math.ceil(page/2) + urlsufMob1;
	} else {
		return urlpre + Math.ceil(page/2) + urlsufMob2;
	}
}
function LoadPage(page) {
	new Image().src = GetPageURL(page);
}
function RenderPage(page) {
	img1.src = GetPageURL(page);
  	document.getElementById('page_num').textContent = page;
}
/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;

  RenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= numPages) {
    return;
  }
  pageNum++;
  RenderPage(pageNum);
  if (pageNum + preLoadNum <= numPages) {
  	LoadPage(pageNum + preLoadNum);
  }
}
document.getElementById('next').addEventListener('click', onNextPage);

function ChangeBook() {
	if (bookId == 1) {
		bookId = 2;
	} else {
		bookId = 1;
	}
	window.location.href = window.location.href.substring(0, window.location.href.length -1) + bookId;
}
document.getElementById('changeBook').addEventListener('click', ChangeBook);

function IsPC(){  
     var userAgentInfo = navigator.userAgent;
     var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
     var flag = true;  
     for (var v = 0; v < Agents.length; v++) {  
         if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
     }  
     return flag;  
}

isPc = IsPC();

if (isPc) {
	var timestampLast = 0;
	var scrollFunc = function (e) { 
		var timestamp = new Date().getTime();
		if (timestamp - timestampLast >= 10) {
			timestampLast = timestamp;
			e = e || window.event; 
			var wheel = e.wheelDelta ? e.wheelDelta : e.detail;
			//console.log(wheel);
			if (wheel > 0) {
				onPrevPage();
			} else {
				onNextPage();
			}
		}


	}
	//给页面绑定滑轮滚动事件 
	if (document.addEventListener) {//firefox 
		document.addEventListener('DOMMouseScroll', scrollFunc, false); 
	} 
	//滚动滑轮触发scrollFunc方法 //ie 谷歌 
	window.onmousewheel = document.onmousewheel = scrollFunc;	
} else {
	// 开始按下手机的起点坐标
    var startPoint = null;
    document.addEventListener("touchstart",function(e){
    	var e = e||window.event;
    	startPoint = e.touches[0];
    })
    document.addEventListener("touchend",function(e){
    		var e=e||window.event;
    		//e.changedTouches能找到离开手机的手指，返回的是一个数组
    		var endPoint = e.changedTouches[0];
    		//计算终点与起点的差值
    		var x = endPoint.clientX - startPoint.clientX;
    		var y = endPoint.clientY - startPoint.clientY;
    		//设置滑动距离的参考值
    		var d = 130;
    		if(Math.abs(x)>d){
    			if(x>0){
				onPrevPage();
    			console.log("向右滑动");
    			}else{
				onNextPage();
    			console.log("向左滑动");
    			}
    		}
    		if(Math.abs(y)>d){
    			if(y>0){
    			console.log("向下滑动");
    			}else{
    			console.log("向上滑动");
    			}
    		}
    	
    })
}

if (isPc) {
	document.getElementById('note').textContent = "支持鼠标滚轮翻页";
} else {
	document.getElementById('note').textContent = "支持左右滑动翻页";
	numPages *= 2;
}


document.getElementById('page_count').textContent = numPages;
RenderPage(pageNum);
for (var i = 1; i <= preLoadNum && i + pageNum <= numPages; i++) {
	LoadPage(i + pageNum);
}


