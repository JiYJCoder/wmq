$(function(){
    //头部导航路由
    $('.headBoxNav ul li').click(function(){
        if($(this).index()==0){
            window.location.href="index.html";
        }else if($(this).index()==1){
            window.location.href="position.html";
        }else if($(this).index()==2){
            window.location.href="study.html";
        }else if($(this).index()==3){
            window.location.href="informationAll.html";
        }else if($(this).index()==4){
            window.location.href="http://h5.wmq1688.com/my/";
        }else if($(this).index()==5){
            window.location.href="index.html#page7";
        }
    });
    //尾部导航路由
    $('.footBottomBox ul li').click(function(){
        if($(this).index()==1){
            window.location.href="index.html";
        }else if($(this).index()==2){
            window.location.href="position.html";
        }else if($(this).index()==3){
            window.location.href="study.html";
        }else if($(this).index()==4){
            window.location.href="informationAll.html";
        }else if($(this).index()==5){
            window.location.href="http://h5.wmq1688.com/my/";
        }else if($(this).index()==6){
            window.location.href="index.html#page7";
        }else if($(this).index()==0){
            window.open("http://www.gzskxx.com");
        }
    });
    //资讯子模块导航
    $('.informFirstListHeadNav ul li').click(function(){
        if($(this).index()==1){
            window.location.href="informationMRT.html";
        }else if($(this).index()==2){
            window.location.href="informationGH.html";
        }else if($(this).index()==3){
            window.location.href="informationVideo.html";
        }else if($(this).index()==4){
            window.location.href="informationSC.html";
        }else if($(this).index()==5){
            window.location.href="informationQT.html";
        }
    });
    $('.mrtLeftNav ul li').click(function(){
        if($(this).index()==0){
            window.location.href="informationMRT.html";
        }else if($(this).index()==1){
            window.location.href="informationGH.html";
        }else if($(this).index()==2){
            window.location.href="informationVideo.html";
        }else if($(this).index()==3){
            window.location.href="informationSC.html";
        }else if($(this).index()==4){
            window.location.href="informationQT.html";
        }
    });
    //注册跳转
    $('.loginTip >span').click(function(){
        window.location.href="http://www.wmq1688.com/signup";
    });
    $('.login >p').eq(1).click(function(){
        window.location.href="http://www.wmq1688.com/signup";
    });
    //我的跳转
    $('.myPerList ul li').eq(0).click(function(){
        window.location.href="http://www.wmq1688.com/console";
    });
})
var url ="http://112.74.87.226:8080/home";//本地测试
// var url ="/home";//服务器测试
// var url ="http://www.wmq1688.com/";//正式环境
//判断非空
function noempty(arr){
    var emptyVal ;
    for(var i=0 ;i<arguments.length;i++){
        if(arguments[i]==""){
            tip(arguments[0][i-1]);
            emptyVal = arguments[i]
            break;
        }
    }
    if(emptyVal==""){
        return false;
    }else{
        return true;
    }
}
//tip
function tip(text){
    if(!$(".tip").hasClass("tip")){
        $("body").append("<div class='tip'></div>");
    }
    $('.tip').text(text).show();
    setTimeout(function(){
        $('.tip').fadeOut();
    },1500)
}
//通用tab
function tab(btn,box){
    $(document).on("click",btn,function(){
        $(this).addClass("current").siblings().removeClass('current');
        $(box).hide().eq($(this).index()).show();
    });
}
//string转arr
function stringToArray(string){
    var dataStrArr;
    if(string.indexOf(",")!=-1){
        dataStrArr=string.split(',');
    }else{
        dataStrArr=[string];
    }

    return dataStrArr;
}
//封装ajax
function ajaxPackage(url,json){
    return $.ajax({
        url:url,
        type:'POST',
        dataType:'json',
        data:json,
    })
}
//获取url参数
function getUrl() { 
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object(); 
    if (url.indexOf("?") != -1) { 
        var str = url.substr(1);
        strs = str.split("&"); 
        for(var i = 0; i < strs.length; i ++) { 
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
        } 
    }
    return theRequest; 
}
//hover更换图标
function baseHovr(box,arrImg){
    var oldArrImg=[];
    $(box).each(function(){
        var oldImg = $(this).css("background-image");
        var that = $(this);
        oldArrImg.push(oldImg);
        setTimeout(function(){
            if(that.hasClass("current")){
                that.css("background-image",arrImg[that.index()])
            }
        },0)
        
    });
    $(box).hover(function(){
        $(this).css("background-image",arrImg[$(this).index()])
    },function(){
        if($(this).hasClass("current")){
            return false;
        }else{
            $(this).css("background-image",oldArrImg[$(this).index()])
        }
        
    })
}

//实现智能搜索
function serchKeys(box,key) {
    $(box).keyup(function () {
        var keys = $(this).val();
        $(key).each(function () {
            var title =$(this).find(".talkName").text();
            if(title.indexOf(keys)>=0){
                $(this).show();
            }else{
                $(this).hide();
            }

        })
    })
}

