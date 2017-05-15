$(function(){
    //个人中心聊天切换
    $('.tab').click(function () {
        $(this).addClass('current').siblings().removeClass('current');
        if($(this).index()==1){
            $("#perdetail").hide();
        }else if($(this).index()==0){
            $("#perdetail").show();
        }
    })
    //首页第一版面效果
    $('.firstPageBottom ul li').hover(function(){
        $(this).find(".p2").fadeIn(300);
    },function(){
        $(this).find(".p2").fadeOut(300);
    })
    //登录TAB
    $(document).on("click",".loginBoxBtn ul li",function(){
        if($(this).index()==1){
            $('.loginBtn').hide();
        }else{
            $('.loginBtn').show();
        }
        $(this).addClass("current").siblings().removeClass('current');
        $(".loginTabBox").hide().eq($(this).index()).show();
    });
    //在线学院三级导航
    function studyNav(){
        $(document).on("click",".studyListLNav ul li",function(){
            if($(this).parents(".titleNextLi").hasClass("titleNextLi")){
                return false;
            }
            if($(this).children("ul").is(":hidden")){
                $(this).css("background","url(images/studyNavIcon.png) left 5px no-repeat").children("ul").slideDown(300);
            }else{
                $(this).css("background","url(images/studyNavSelIcon.png) 0px 10px no-repeat").children("ul").slideUp(300);
            }
            return false;
        });
    };
    //头部下拉
    $(window).scroll(function() {
		if ($(window).scrollTop() > 70){
			$(".head").addClass("onHead");
		}else{
			$(".head").removeClass("onHead");
		}
	});
    //input通用框
    $('.baseInput').focus(function (e) {
        var boderCol =$(this).css("border-color");
        $(this).attr("col",boderCol);
        $(this).css({
            border:"1px solid #ff884d"
        })
    }).blur(function(){
        var col =$(this).attr("col")
        $(this).css({
            border:"1px solid "+col
        })
    });
    var t =[];
    //登录框显示
    $('.loginTabBoxInput').focus(function (e) {
        var boderCol =$(this).parent().css("border-color");
        var bgUrl =$(this).prev().css("backgroundImage");
        var url =  $(this).prev().attr("bgurl");
        $(this).prev().attr("JbgUrl",bgUrl);
        $(this).attr("col",boderCol);
        $(this).parent().css({
            border:"1px solid #ff884d",
        });
    }).blur(function(){
        var col =$(this).attr("col");
        var url =$(this).prev().attr("JbgUrl");
        $(this).parent().css({
            border:"1px solid "+col
        });
    });
    //文章详情评论框
    $(document).on("click",'.artDetailsLeftTalkList .reply',function(){
        if($(this).parent().find(".talkBox").is(":hidden")){
            $(this).parent().find(".talkBox").show();
        }else{
            $(this).parent().find(".talkBox").hide();
        }
    })
    $(document).on("click",'.artDetailsLeftTalkList .talkBoxBtn .cancel',function(){
        $(this).parents(".talkBox").hide();
    })
    //提示，以后要删除的
    $('.artDetailsLeftPlayBtn,.artDetailsLeftPublished,.posDetailsDataBtn').click(function(){
        tip("正在努力开发，请期待哦！");
    });
    //首页点击二维码登录
    $('.firstPageBottom ul li.center').click(function(){
        $('.loginBox ,.bg').show();
        $('.loginTabBox').hide().eq(1).show();
        $('.loginBoxBtn ul li').removeClass('current').eq(1).addClass('current');
        getEwm();
    })
    //职位搜索高度自动
    $('.allTipWay').click(function(){
        if($(this).parents("li").hasClass("autoHeight")){
            $(this).parents("li").removeClass("autoHeight")
        }else{
            $(this).parents("li").addClass('autoHeight');
        }

    })
    //登录显示详细
    $('.myPer').hover(function(){
        $(".myPerList").show();
    },function(){
        $(".myPerList").hide();
    });
    //个人中心左侧导航
    $('.personSet ul li').click(function(){
        $(this).addClass("current").siblings().removeClass("current");
        if($(this).find(".child").is(":hidden")){
            $(this).find(".child").slideDown();
        }else{
            $(this).find(".child").slideUp();
        }
    });
    //首页动画
    baseHovr('.videoMoreLeftBtn ul li',["url(images/videoIcon1.png)","url(images/videoIcon2Sel.png)","url(images/videoIcon3Sel.png)"])
    studyNav();
})
// 文章详情作者头像没返回，资讯社区最新未返回文章ID
