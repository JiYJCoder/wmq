//登录
function login(){
    $('#loginBtn').click(function(){
        $(".loginBox, .bg").show();
    });
    $('.loginBoxClose').click(function(){
        $(".loginBox, .bg").hide();
    });
    //退出登录
    $('#offLogin').click(function(){
        ajaxPackage(url+"/common/signOut")
        .done(function(data){
            var {code,message,data}=data;
            if(code==0){
                tip(message);
                $('.myPer').hide();
                $('.login').show();
            }
        })
    })
    //获取验证码
    $('.loginTabBoxYzmBtn').click(function(){
        var mobile = $("#yzmPhone").val();
        var tipArr=["手机号码不能为空"];
        if(noempty(tipArr,mobile)==true){
            ajaxPackage(url+"/common/sendMms",{
                "mobile":mobile
            })
            .done(function(){
                tip("发送成功，请注意查收");
                var num=60;
                $(".loginTabBoxYzmBtn").hide();
                $('.loginTabBoxYzmNum').text(num).show();
                var t=setInterval(function(){
                    num -=1;
                    if(num==0){
                        $('.loginTabBoxYzmNum').hide();
                        $(".loginTabBoxYzmBtn").show();
                        clearInterval(t);
                    }else{
                        $('.loginTabBoxYzmNum').text(num);
                    }

                },1000)
            })
            .fail(function(){

            })
        }
    });
    //确定登录
    $(document).keydown(function (e) {
        if(e.keyCode ==13&&$('.loginBox').is(":visible")){
            if($('.loginTabBox').eq(0).is(":visible")){
                $('#pswLogin').click();
            }else if($('.loginTabBox').eq(2).is(":visible")){
                $('#yzmLogin').click();
            }
        }
    });
    //验证验证码并登录
    $('#yzmLogin').click(function(){
        var mobile = $("#yzmPhone").val();
        var yzm = $("#yzmBox").val();
        var tipArr =["手机号不能为空","验证码不能为空"];
        if(noempty(tipArr,mobile,yzm)==true){
            ajaxPackage(url+"/common/checkSms",{
                "mobile":mobile,
                "code":yzm
            })
            .done(function(data){
                ajaxPackage(url+"/common/phoneSignin",{
                    "mobile":mobile
                })
                .done(function(data){
                    var {code,message,data} =data;
                    if(code ==0){
                        var faceUrl=data.face;
                        var name =data.truename;
                        tip(message);
                        $('.myPerImg img').attr("src",faceUrl);
                        $('.myPer p').text(name);
                        $('.bg ,.loginBox,.login').hide();
                        $('.myPer').show();
                    }else if(code ==1){
                        tip("验证码错误");
                    }
                })

            })
        }
    });
    //密码登录
    $('#pswLogin').click(function(e){
        var mobile = $("#pswPhone").val();
        var password= $("#password").val();
        var tipArr =["手机号不能为空","密码不能为空"];

        if(noempty(tipArr,mobile,password)==true){
            ajaxPackage(url+"/common/signinPost",{
                "mobile":mobile,
                "password":password
            })
            .done(function(data){
                var {code,data} =data;
                if(code ==0){
                    var faceUrl=data.face;
                    var name =data.truename;
                    tip("登录成功");
                    $('.myPerImg img').attr("src",faceUrl);
                    $('.myPer p').text(name);
                    $('.bg ,.loginBox,.login').hide();
                    $('.myPer').show();
                }else if(code ==1){
                    tip("账号或密码错误");
                }
            })
        }
    });
    //获取二维码key并登录
    $('.loginBoxBtn ul li').eq(1).click(function(){
        getEwm();
    })
}
//获取二维码
function getEwm(){
    ajaxPackage(url+"/common/signin")
    .done(function(data){
        $('.loginTabBoxEwmImg').empty();
        $('.loginTabBoxEwmImg').qrcode({
            text:data.data,
            width:180,
            height:180
        });
        var t=setInterval(function(){
            ajaxPackage(url+"/common/signtime")
            .done(function(data){
                var {code,message,totalCount,data}=data;
                if(code==0){
                    clearInterval(t);
                    tip(message);
                    $('.myPerImg img').attr("src",data.faceUrl);
                    $('.myPer p').text(data.truename);
                    $('.bg ,.loginBox,.login').hide();
                    $('.myPer').show();
                }
                if($('.login').is(":hidden")){
                    clearInterval(t);
                    $('.bg ,.loginBox,.login').hide();
                    $('.myPer').show();
                }
            })
        },3000)
    })
}
//获取城市
function address(){
    //设置省份
    var province = ".positionRightSerchAddresListCommon ul li";
    var city =".positionRightSerchAddresListCity ul li";
    $('.positionRightSerchAddress').hover(function(){
        $('.positionRightSerchAddresList').show();
    },function(){
        $('.positionRightSerchAddresList').hide();
    });
    ajaxPackage(url+"/job/getCommonCity")
    .done(function(data){
        var {code,message,totalCount,data} =data;
        for(var i=0;i<data.length;i++){
            $('.positionRightSerchAddresListCommon ul').append(`<li data="${data[i].id}">${data[i].name}</li>`);
        }

    });
    //获取城市
    $(document).on("mouseover",province,function(){
        var id =$(this).attr("data");
        $(this).css({
            backgroundColor:"#fff",
            color:"#ff884d"
        });
        ajaxPackage(url+"/job/getRegion",{
            "provinceId":id
        })
        .done(function(data){
            $('.positionRightSerchAddresListCity ul').empty();
            var {code,message,totalCount,data} =data;
            for(var i=0;i<data.length;i++){
                $('.positionRightSerchAddresListCity ul').append(`<li data="${data[i].id}">${data[i].name}</li>`)
            }
        })
    })
    $(document).on("mouseout",province,function(){
        $(this).css({
            backgroundColor:"#f2f2f2",
            color:"#333"
        });
    });
    $(document).on("mouseout",city,function(){
        $(this).css({
            backgroundColor:"#f2f2f2",
            color:"#333"
        });
    });
    $(document).on("mouseover",city,function(){
        $(this).css({
            backgroundColor:"#fff",
            color:"#ff884d"
        });
    });
    $(document).on("click",city,function(){
        var id = $(this).attr("data");
        var name = $(this).text();
        $('#serchCity').attr("data",id).text(name);
        $('.positionRightSerchAddresList').hide();
    });
}
//职位
function position(){
    posClisk();
    posSerach();
    loginIs();
    //获取职位列表
    ajaxPackage(url+"/job/getRecruitJobList")
    .done(function(data){
        function arrRecursive(arr){
            for(var i=0;i<arr.length;i++){
                $('.positionLeft >ul').append(`<li><p class="title">${arr[i].title}</p>
                        <ul class="clearfix list">

                        </ul></li>`);
                if(arr[i].list != undefined){
                    for(var t= 0;t<arr[i].list.length;t++){
                        $('.list').eq(i).append(`<li id=${arr[i].list[t].id}>${arr[i].list[t].title}</li>`);
                    }
                }
            }
        }
        arrRecursive(data.data);
    });
    //外贸经理首显示
    ajaxPackage(url+"/job/classJobPage",{
        "classId":"100111"
    })
    .done(function(data){
        $('.positionRightList ul').empty();
        var {code,data} =data;
        for(var i=0;i<data.length;i++){
            $('.positionRightList ul').append(`<li class="clearfix posClisk" data-id="${data[i].jobId}">
                <div class="positionRightListImg">
                    <img src="${data[i].hrFace}" alt="" width="69" height="69">
                </div>
                <div class="positionRightListText">
                    <p class="title">${data[i].title}</p>
                    <p class="p1">${data[i].hrName} | ${data[i].hrCompany} | ${data[i].hrPosition}</p>
                    <p class="p2">公司规模  |  ${data[i].companyStaffNum}  |  ${data[i].companyFinance}</p>
                </div>
                <div class="positionRightListData">
                    <p class="style">${data[i].payStart}-${data[i].payEnd}</p>
                    <p class="data">${data[i].workCity}   |   ${data[i].workYear}   |   ${data[i].education}</p>
                </div>
            </li>`);
            if(data[i].payEnd==0){
                $('.positionRightListData .style').text("面议");
            }
        }
    });
    //获取分类列表
    $(document).on("click",".positionLeft .list li", function () {
        var id =$(this).attr("id");
        ajaxPackage(url+"/job/classJobPage",{
            "classId":id
        })
        .done(function(data){
            var {code,data} =data;
            if(data.length==0){
                tip("没有数据，请重新查询其他岗位")
            }else{
                $('.positionRightList ul').empty();
                for(var i=0;i<data.length;i++){
                    $('.positionRightList ul').append(`<li class="clearfix posClisk" data-id="${data[i].jobId}">
                        <div class="positionRightListImg">
                            <img src="${data[i].hrFace}" alt="" width="69" height="69">
                        </div>
                        <div class="positionRightListText">
                            <p class="title">${data[i].title}</p>
                            <p class="p1">${data[i].hrName} | ${data[i].hrCompany} | ${data[i].hrPosition}</p>
                            <p class="p2">公司规模  |  ${data[i].companyStaffNum}  |  ${data[i].companyFinance}</p>
                        </div>
                        <div class="positionRightListData">
                            <p class="style">${data[i].payStart}-${data[i].payEnd}</p>
                            <p class="data">${data[i].workCity}   |   ${data[i].workYear}   |   ${data[i].education}</p>
                        </div>
                    </li>`);
                    if(data[i].payEnd==0){
                        $('.positionRightListData .style').text("面议");
                    }
                }
            }

        });
    });
}
function article(){
    atrDetail();
    loginIs();
    //获取最新文章
    ajaxPackage(url+"/articlenew/getNewOrHottest",{
        "sort":0
    })
    .done(function(data){
        // console.log(data)
        var {code,message,data}= data;
        var box=$('.informFirstListHotLeftList ul');
        var rightBox=$(".informFirstListHotRight");
        rightBox.html(`<p class="title">${data.title}</p>
        <div class="informFirstListHotRightVideo artClick" artId="${data.id}">
            <img src="${data.cover}" alt="">
        </div>
        <div class="informFirstListHotRightData clearfix">
            <div class="informFirstListHotRightDataImg">
                <img src="${data.face}" alt="">
            </div>
            <div class="informFirstListHotRightDataText">
                <p>作者${data.name}</p>
                <p>发布时间：${data.time}</p>
            </div>
            <a href="informationVideo.html" class="moreVideo">更多视频>></a>
        </div>`);
        box.empty();
        for(var i=0 ; i<data.list.length;i++){
            box.append(`<li class="clearfix artClick" artId="${data.list[i].id}">
                <div class="informFirstListHotLeftListImg">
                    <img src="${data.list[i].cover}" alt="" width="111" height="57">
                </div>
                <div class="informFirstListHotLeftListText">
                    <p>${data.list[i].title}</p>
                </div>
            </li>`);
        }
    });
    //最新最热切换
    $('.informFirstListHotLeftNavBtn').click(function(){
        var id =Number($(this).attr("sort"));
        var that=$(this);
        ajaxPackage(url+"/articlenew/getNewOrHottest",{
            "sort":id
        })
        .done(function(data){
            $('.informFirstListHotLeftNavBtn').removeClass('current');
            that.addClass("current");
            var {code,data,message}= data;
            var box=$('.informFirstListHotLeftList ul');
            box.empty();
            for(var i=0 ; i<data.list.length;i++){
                box.append(`<li class="clearfix artClick" artId="${data.list[i].id}">
                    <div class="informFirstListHotLeftListImg">
                        <img src="${data.list[i].cover}" alt="" width="111" height="57">
                    </div>
                    <div class="informFirstListHotLeftListText">
                        <p>${data.list[i].title}</p>
                    </div>
                </li>`);
            }
        });
    });
    //获取资讯社区所有文章
    ajaxPackage(url+"/articlenew/getForumBoradList")
    .done(function(data){
        var {code,message,data} =data;
        // console.log(data);
        //循环名人堂
        $.each(data.celebrityBorad.list,function(index,val){
            // console.log(val.list)
            $('.mrtList >ul').append(`<li class="clearfix">
                <div class="mrtListImg">
                    <img src="${val.face}" alt="" width="140" height="120">
                </div>
                <div class="mrtListText">
                    <ul>

                    </ul>
                </div>
            </li>`);

            $.each(val.list,function(t,val){
                $('.mrtListText ul').eq(index).append(`<li class="artClick" artId="${val.id}">${val.title}</li>`)
            })
        });
        //循环干货
        $.each(data.DriedFoodBorad.LeftList,function(index,val){
            $('#ganhuoLeft ul').append(`<li class="artClick" artId="${val.id}">${val.title}</li>`)
        });
        $.each(data.DriedFoodBorad.rightList,function(index,val){
            $('#ganhuoRight ul').append(`<li class="artClick" artId="${val.id}">
                <img src="${val.cover}" alt="" width="500" height="255">
                <p>${val.title}</p>
            </li>`)
        });
        //循环视频
        $.each(data.videoBorad.list,function(index,val){
            $('.videoList ul').append(`<li class="artClick" artId="${val.id}">
                <div class="videoSrc">
                    <img src="${val.cover}" alt="" width="379" height="220">
                </div>
                <p>${val.title}</p>
            </li>`);
        });
        //循环实操
        $.each(data.operationBorad.leftList,function(index,val){
            if(index==0){
                $('.shicaoListBig').attr("artId",val.id).addClass("artClick");
                $('.shicaoListBig img').attr("src",val.cover);
                $('.shicaoListBig p').text(val.title);
            }
            if(index>0){
                $('.shicaoListCenter ul').append(`<li class="artClick" artId="${val.id}">${val.title}</li>`);
            }
        });
        $.each(data.operationBorad.rightList,function(index,val){
            $('.shicaoListRight ul').append(`<li class="artClick" artId="${val.id}">
                <img src="${val.cover}" alt="" width="290" height="159">
                <p>${val.title}</p>
            </li>`);
        });
        //循环其他
        $.each(data.otherBorad.LeftList,function(index,val){
            $('#qitaLeft ul').append(`<li class="artClick" artId="${val.id}">${val.title}</li>`);
        });
        $.each(data.otherBorad.rightList,function(index,val){
            $('#qitaRight ul').append(`<li class="artClick" artId="${val.id}">
                <img src="${val.cover}" alt="" width="500" height="255">
                <p>${val.title}</p>
            </li>`);
        });

    });
    //文章搜索
    $(".informFirstListHeadSearhBtn").click(function(){
        var key =$('.informFirstListHeadSearhbox input').val();
        if($('.informFirstListHeadSearhbox input').val()==""){
            tip("请输入作者或者文章标题");
        }else{
                window.open(`informationSearch.html?kw=${key}`)
        }
    });
}
//文章搜索页面
function artSerchKey(){
    atrDetail();
    loginIs();
    var key = getUrl().kw;
    ajaxPackage(url+"/articlenew/getSearchArticleListPage",{
        "toPage":1,
        "key":key
    })
    .done(function(data){
        var {code,totalCount,data}= data;
        pageList(10,totalCount,searchPage);
        for(var i=0;i<data.searchList.length;i++){
            if(data.searchList[i].forumAbstract=="null"||data.searchList[i].forumAbstract==null){
                data.searchList[i].forumAbstract="";
            }
            $('.mrtLeftList ul').append(`<li class="artClick" data-search="1" artId="${data.searchList[i].id}">
                <h3>${data.searchList[i].title}</h3>
                <div class="mrtLeftListP">
                    <p>${data.searchList[i].forumAbstract}</p>
                </div>
                <div class="mrtLeftListTip">
                    <span>日期：${data.searchList[i].createTime}</span>
                    <span>阅读：${data.searchList[i].viewNum}</span>
                    <span>作者：${data.searchList[i].name}</span>
                </div>
            </li>`)
        }
    });
    //搜索文章
    $(".informFirstListHeadSearhBtn").click(function(){
        var key =$('#serchBox .baseInput').val();
        if(key ==""){
            tip("请输入搜索关键词");
        }else{
            ajaxPackage(url+"/articlenew/getSearchArticleListPage",{
                "toPage":1,
                "key":key
            })
            .done(function(data){
                window.location.href=`informationSearch.html?kw=${key}`
                // console.log(data);
                $('.mrtLeftList ul').empty();
                var {code,totalCount,data}= data;
                pageList(10,totalCount,searchPage);
                for(var i=0;i<data.searchList.length;i++){
                    if(data.searchList[i].forumAbstract=="null"||data.searchList[i].forumAbstract==null){
                        data.searchList[i].forumAbstract="";
                    }
                    $('.mrtLeftList ul').append(`<li class="artClick" data-search="1" artId="${data.searchList[i].id}">
                        <h3>${data.searchList[i].title}</h3>
                        <div class="mrtLeftListP">
                            <p>${data.searchList[i].forumAbstract}</p>
                        </div>
                        <div class="mrtLeftListTip">
                            <span>日期：${data.searchList[i].createTime}</span>
                            <span>阅读：${data.searchList[i].viewNum}</span>
                            <span>作者：${data.searchList[i].name}</span>
                        </div>
                    </li>`)
                }
            });
        }
    })

}
//文章搜索列表页面
function searchPage(num){
    loginIs();
    var key = getUrl().kw;
    ajaxPackage(url+"/articlenew/getSearchArticleListPage",{
        "toPage":num,
        "key":key
    })
    .done(function(data){
        $('.mrtLeftList ul').empty();
        var {code,totalCount,data}= data;
        for(var i=0;i<data.searchList.length;i++){
            if(data.searchList[i].forumAbstract=="null"||data.searchList[i].forumAbstract==null){
                data.searchList[i].forumAbstract="";
            }
            $('.mrtLeftList ul').append(`<li class="artClick" data-search="1" artId="${data.searchList[i].id}">
                <h3>${data.searchList[i].title}</h3>
                <div class="mrtLeftListP">
                    <p>${data.searchList[i].forumAbstract}</p>
                </div>
                <div class="mrtLeftListTip">
                    <span>日期：${data.searchList[i].createTime}</span>
                    <span>阅读：${data.searchList[i].viewNum}</span>
                    <span>作者：${data.searchList[i].name}</span>
                </div>
            </li>`)
        }
    });
}
// 翻页
function pageList(num,sum,callBack){
    $(document).off("click",".mrtLeftListPage ul li");
    //总页数
    var totalPage =Math.ceil(sum/num);
    var li  = $('.mrtLeftListPage ul li');
    //删除按钮
    for (var t=0 ;t<li.size();t++){
        if(!(li.eq(t).hasClass("next")||li.eq(t).hasClass("pre"))){
            li.eq(t).remove();
        }
    }
    //生产按钮
    if(totalPage<=5&&totalPage>0){
        for(var i=0 ;i<totalPage;i++){
            $('.next').before("<li>"+(i+1)+"</li>")
        }
    }else if(totalPage>5){
        for(var i=0 ;i<5;i++){
            $('.next').before("<li>"+(i+1)+"</li>")
        }
    }else if(totalPage==0){
        $('.next').before("<li>1</li>")
    }
    $('.mrtLeftListPage ul li').eq(1).addClass('current');
    $(document).on("click",".mrtLeftListPage ul li",function(){
        var nowLi=$(".mrtLeftListPage ul li.current");
        var li=$(".mrtLeftListPage ul li");
        var nowNum=Number(nowLi.text());
        var nowIndex=nowLi.index();
        var nextNum=Number(nowLi.text())+1;
        var preNum=Number(nowLi.text())-1;
        var  id =Number($('.mrtLeftNav ul li.current').attr("dataid"))
        if($(this).hasClass("pre")){
                if(nowLi.text()=="1"){
                    tip('已经是第一页');
                }else{
                    if(nowIndex==1){
                        li.eq(5).remove();
                        li.removeClass('current');
                        $('.pre').after("<li class='current'>"+(nowNum-1)+"</li>");
                    }else{
                        li.removeClass('current');
                        li.eq(nowIndex-1).addClass("current");
                    }
                    callBack(preNum,id);
                }
            }else if($(this).hasClass("next")){
                if(nowNum==Number(totalPage)){
                    tip('已经是最后一页');
                }else{
                    if(nowIndex==5&&nowLi.text()!=totalPage){
                        li.eq(1).remove();
                        li.removeClass('current');
                        $('.next').before("<li class='current'>"+(nowNum+1)+"</li>");
                    }else{
                        li.removeClass('current');
                        li.eq(nowIndex+1).addClass("current");
                    }
                    callBack(nextNum,id)

                }
            }else if(!$(this).hasClass("current")){
                var nowNum=Number($(this).text());
                $(this).addClass('current').siblings().removeClass("current");
                callBack(nowNum,id);
            }
    })
}
//资讯子模块
function articleChild(num,id){
    loginIs();
    ajaxPackage(url+'/articlenew/getBoradArcitleListPage',{
        "toPage":num,
        "boradId":id,
    })
    .done(function(data){
        var {code,totalCount,data}= data;
        pageList(7,totalCount,articleChildPage);
        for(var i=0;i<data.length;i++){
            if(data[i].forumAbstract=="null"||data[i].forumAbstract==null){
                data[i].forumAbstract="";
            }
            $('.mrtLeftList ul').append(`<li class="artClick" artId="${data[i].id}">
                <h3>${data[i].title}</h3>
                <div class="mrtLeftListP">
                    <p>${data[i].forumAbstract}</p>
                </div>
                <div class="mrtLeftListTip">
                    <span>日期：${data[i].createTime}</span>
                    <span>阅读 ${data[i].viewNum}</span>
                </div>
            </li>`)
        }
    });
    //获取子版块推荐
    ajaxPackage(url+"/articlenew/getHotArticleList",{
        "boradId":id
    })
    .done(function(data){
        var {code,data} =data;
        for(var i =0;i<4;i++){
            if(data[i].forumAbstract=="null"||data[i].forumAbstract==null){
                data[i].forumAbstract="";
            }
            $('.mrtRightList ul').append(`<li class="artClick" artId="${data[i].id}">
                <div class="mrtRightListImg"><img src="${data[i].cover}" alt="" width="374" height="234"></div>
                <div class="mrtRightListText">
                    <p class="title">${data[i].title}</p>
                    <p class="bewrite">${data[i].forumAbstract}</p>
                </div>
            </li>`)
        }
        // console.log(data)
    })
    atrDetail();
}
function articleChildPage(num,id){
    ajaxPackage(url+'/articlenew/getBoradArcitleListPage',{
        "toPage":num,
        "boradId":id,
    })
    .done(function(data){
        var {code,totalCount,data}= data;
        $('.mrtLeftList ul').empty();
        for(var i=0;i<data.length;i++){
            if(data[i].forumAbstract=="null"||data[i].forumAbstract==null){
                data[i].forumAbstract="";
            }
            $('.mrtLeftList ul').append(`<li class="artClick" artId="${data[i].id}">
                <h3>${data[i].title}</h3>
                <div class="mrtLeftListP">
                    <p>${data[i].forumAbstract}</p>
                </div>
                <div class="mrtLeftListTip">
                    <span>日期：${data[i].createTime}</span>
                    <span>阅读 ${data[i].viewNum}</span>
                </div>
            </li>`)
        }

    })
}
//职位搜索跳转
function posSerach(){
    $('.searchA').click(function(){
        var key = $('#artSerchKey').val();
        var cityId =$('#serchCity').attr("data");
        var cityName=$("#serchCity").text();
        window.location.href=`positionSearch.html?key=${key}&cityId=${cityId}&cityName=${cityName}`;
    });
}
//文章详情
function atrDetail(){
    //跳转
    $(document).on("click",".artClick",function(){
        var id =$(this).attr("artid");
        var type =1;
        if($(this).attr("data-search")=="1"){
            type =1;
        }else{
            type =0;
        }
        window.location.href=`informationDetails.html?artid=${id}&type=${type}`;
    })
}
function atrDetailLoad(){
    atrDetail();
    loginIs();
    var id =getUrl();
    //获取文章详情
    ajaxPackage(url+"/articlenew/getArticleDetails",{
        "id":Number(id.artid),
        "type":Number(id.type)
    })
    .done(function(data){
        var {code,data} =data;
        $('.artDetailsLeftCon .title').text(data.title);
        $('.artDetailsLeftCon .con').html(data.content);
        $('.artDetailsLeftConPerText .per').text(data.name);
        $('.artDetailsLeftConPerText .date').text("日期："+data.time);
        $('.artDetailsLeftConPerText .viewNum').text("阅读："+data.viewNum);
        if(!data.lower){
            $('.artDetailsLeftSwitch .nexts').html("<span>下一篇：</span>没有了")
        }else{
            $('.artDetailsLeftSwitch .nexts').html(`<span>下一篇：</span>${data.lower.title}`).attr("artid",data.lower.id).addClass("artClick");
        }
        if(!data.upper){
            $('.artDetailsLeftSwitch .pres').html("<span>上一篇：</span>没有了")
        }else{
            $('.artDetailsLeftSwitch .pres').html(`<span>上一篇：</span>${data.upper.title}`).attr("artid",data.upper.id).addClass("artClick");
        }
        for(var i =0 ;i<4;i++){
            if(!data.rightList[i].forumAbstract){
                data.rightList[i].forumAbstract ="";
            }
            $('.mrtRightList >ul').append(`<li class="artClick" artId="${data.rightList[i].id}">
                <div class="mrtRightListImg"><img src="${data.rightList[i].cover}" alt="" width="374" height="234"></div>
                <div class="mrtRightListText">
                    <p class="title">${data.rightList[i].title}</p>
                    <p class="bewrite">${data.rightList[i].forumAbstract}</p>
                </div>
            </li>`)
        }
        $('.artDetailsLeftConPerImg > img').attr("src",data.face)
    });
    //评论列表翻页
    function talkListPage(num){
        ajaxPackage(url+"/articlenew/getCommentsPage",{
            "articleId":Number(id.artid),
            "toPage":num
        })
        .done(function(data){
            var {code,totalCount,data} =data;
            var callname ="";
            $('.artDetailsLeftTalkList >ul').empty();
            for(var i=0 ;i<data.length;i++ ){
                if(data[i].callUserName){
                    callname =`@${data[i].callUserName}`
                }else{
                    callname =""
                }
                $('.artDetailsLeftTalkList >ul').append(`<li class="clearfix" data-id=${data[i].id}>
                    <img src="${data[i].face}" alt="">
                    <p class="per">${data[i].truename}${callname}</p>
                    <p class="time">${data[i].createTime}</p>
                    <p class="reply btns">回复他的评论</p>
                    <div class="clear"></div>
                    <p class="cons">${data[i].content}</p>
                    <div class="talkBox">
                        <div class="talkBoxText" contenteditable="true">

                        </div>
                        <div class="talkBoxBtn clearfix">
                            <span class="review">评论</span>
                            <span class="cancel">取消</span>
                        </div>
                    </div>
                </li>`)
            }
        })
    }
    //获取评论列表
    function talkList(){
        ajaxPackage(url+"/articlenew/getCommentsPage",{
            "articleId":Number(id.artid),
            "toPage":1
        })
        .done(function(data){
            console.log(data);
            var {code,totalCount,data} =data;
            pageList(10,totalCount,talkListPage);
            var callname =""
            $('.artDetailsLeftTalkList >ul').empty();
            if(data.length == 0){
                $(".artDetailsLeftTalkList .tips").show();
            }else{
                $(".artDetailsLeftTalkList .tips").hide();
                for(var i=0 ;i<data.length;i++ ){
                    if(data[i].callUserName){
                        callname =`@${data[i].callUserName}`
                    }else{
                        callname =""
                    }
                    // <p class="good btns">${data[i].praiseNum}人赞</p>取消点赞功能
                    $('.artDetailsLeftTalkList >ul').append(`<li class="clearfix" data-id=${data[i].id}>
                        <img src="${data[i].face}" alt="">
                        <p class="per">${data[i].truename}${callname}</p>
                        <p class="time">${data[i].createTime}</p>
                        <p class="reply btns">回复他的评论</p>
                        <div class="clear"></div>
                        <p class="cons">${data[i].content}</p>
                        <div class="talkBox">
                            <div class="talkBoxText" contenteditable="true">

                            </div>
                            <div class="talkBoxBtn clearfix">
                                <span class="review">评论</span>
                                <span class="cancel">取消</span>
                            </div>
                        </div>
                    </li>`)
                }
            }
        });
    }
    talkList();
    //发表评论
    $('.artDetailsLeftTalk .btn').click(function(){
        var con = $('.artDetailsLeftTalk .text1').val();
        if(con==""){
            tip("评论内容不能为空");
        }else{
            ajaxPackage(url+"/articlenew/signPower/addArticleCommentNew",{
                "articleId":Number(id.artid),
                "parentId":0,
                'content':con
            })
            .done(function(data){
                var {code} =data;
                if(code == 0){
                    tip("评论成功");
                    talkList();
                    $('.artDetailsLeftTalk .text1').val("");
                }else if(code ==1005){
                    tip("请重新登录账号");
                    $('.bg ,.loginBox').show();
                }
            })
        }

    });
    //回复评论
    $(document).on("click",".talkBoxBtn .review",function(){
        var parentId = Number($(this).parents("li").attr("data-id"));
        var con = $('.talkBoxText').text();
        if(con==""){
            tip("回复内容不能为空");
        }else{
            ajaxPackage(url+"/articlenew/signPower/addArticleCommentNew",{
                "articleId":Number(id.artid),
                "parentId":parentId,
                'content':con
            })
            .done(function(data){
                var {code} =data;
                if(code == 0){
                    tip("评论成功");
                    talkList();
                }else if(code ==1005){
                    tip("请重新登录账号");
                    $('.bg ,.loginBox').show();
                }
            })
        }

    })
}
// 首页
function index(){
    atrDetail();
    posSerach();
    loginIs();
    $(document).on("click",".firstPageTextLeftList ul li",function(){
        var key =$(this).text();
        window.location.href= `positionSearch.html?key=${key}`;
    })
    ajaxPackage(url+"/common/getHotSearchList")
    .done(function(data){
        var {code,data} =data ;
        $.each(data.hotJobs,function(index,val){
            $('#indexHotJob ul').append(`<li>${val}</li>`)
        });
        $.each(data.hotCompanys,function(index,val){
            $('#indexHotCompanys ul').append(`<li>${val}</li>`)
        });
    });
    //获取最新
    ajaxPackage(url+"/articlenew/getHomeDriedFoodList",{
        "sort":0
    })
    .done(function(data){
        var {code,data} =data;
        // console.log(data);
        $(".fifthPageLeft").html(`<p class="title">资讯干货</p>
            <div class="fifthPageLeftOne artClick" artId="${data.leftList[0].id}">
                <img src="${data.leftList[0].cover}" alt="" height="440" width="662">
                <p class="TextTitle">${data.leftList[0].title}</p>
            </div>
            <div class="fifthPageLeftTwo clearfix">
                <div class="fifthPageLeftTwoLeft artClick" artId="${data.leftList[1].id}">
                    <img src="${data.leftList[1].cover}" alt="" height="300" width="325">
                    <p class="TextTitle">${data.leftList[1].title}</p>
                </div>
                <div class="fifthPageLeftTwoRight artClick" artId="${data.leftList[2].id}">
                    <img src="${data.leftList[2].cover}" alt="" height="300" width="325">
                    <p class="TextTitle">${data.leftList[2].title}</p>
                </div>
            </div>`);
        for (var i= 0; i<data.rightList.length;i++){
            $(".fifthPageRightList ul").append(`<li class="clearfix artClick" artId="${data.rightList[i].id}">
                <div class="fifthPageRightListImg">
                    <img src="${data.rightList[i].cover}" alt="" width="100" height="58">
                </div>
                <div class="fifthPageRightListText">
                    ${data.rightList[i].title}
                </div>
            </li>`)
        }
    });
    //切换
    $('.fifthPageRightTitle ul li').click(function(){
        var id =Number($(this).attr("sort"));
        var that =$(this);
        ajaxPackage(url+"/articlenew/getHomeDriedFoodList",{
            "sort":id
        })
        .done(function(data){
            $(".fifthPageRightList ul").empty();
            var {code,data} =data;
            that.addClass("current").siblings().removeClass('current');
            console.log(data);
            for (var i= 0; i<data.rightList.length;i++){
                $(".fifthPageRightList ul").append(`<li class="clearfix artClick" artId="${data.rightList[i].id}">
                    <div class="fifthPageRightListImg">
                        <img src="${data.rightList[i].cover}" alt="" width="100" height="58">
                    </div>
                    <div class="fifthPageRightListText">
                        ${data.rightList[i].title}
                    </div>
                </li>`)
            }
        })
    })
}

function positionSearch(){
    loginIs();
    posClisk();
    var urls = getUrl();
    var cityId = Number(urls.cityId) || 0;
    if(cityId !=0){
        $('#serchCity').attr("data",cityId);
        $('#serchCity').text(urls.cityName);
    }
    if(urls.key){
        $('#artSerchKey').val(urls.key);
    }
    //根据关键词
    ajaxPackage(url+"/job/getAllJobPage",{
        "toPage":1,
        "workPayStart":0,
        "workPayEnd":0,
        "workYear":-1,
        "education":-1,
        "cityId":cityId,
        "businessId":0,
        "key":urls.key
    })
    .done(function(data){
        // console.log(data);
        var {code,totalCount,data} =data;
        pageList(20,totalCount,posPage);
        $('.positionRightList ul').empty();
        for(var i=0;i<data.length;i++){
            $('.positionRightList ul').append(`<li class="clearfix posClisk" data-id="${data[i].jobId}">
                <div class="positionRightListImg">
                    <img src="${data[i].hrFace}" alt="" width="69" height="69">
                </div>
                <div class="positionRightListText">
                    <p class="title">${data[i].title}</p>
                    <p class="p1">${data[i].hrName} | ${data[i].hrCompany} | ${data[i].hrPosition}</p>
                    <p class="p2">公司规模  |  ${data[i].companyStaffNum}  |  ${data[i].companyFinance}</p>
                </div>
                <div class="positionRightListData">
                    <p class="style">${data[i].payStart}-${data[i].payEnd}</p>
                    <p class="data">${data[i].workCity}   |   ${data[i].workYear}   |   ${data[i].education}</p>
                </div>
            </li>`);
            if(data[i].payEnd==0){
                $('.positionRightListData .style').text("面议");
            }
        }
    });
    //搜索
    $("#serchBtn").click(function(){
        var workPayStart =$('.posSearchPageFactor ul li.emolument span.current').attr("workPayStart");
        var workPayEnd = $('.posSearchPageFactor ul li.emolument span.current').attr("workPayEnd");
        var workYear = $('.posSearchPageFactor ul li.exp span.current').attr("data-id");
        var education = $('.posSearchPageFactor ul li.edu span.current').attr("data-id");
        var businessId = $('.posSearchPageFactor ul li.tipWay span.current').attr("data-id");
        var cityId = $('#serchCity').attr('data');
        var key =$('#artSerchKey').val();
        ajaxPackage(url+"/job/getAllJobPage",{
            "toPage":1,
            "workPayStart":Number(workPayStart),
            "workPayEnd":Number(workPayEnd),
            "workYear":Number(workYear),
            "education":Number(education),
            "cityId":Number(cityId),
            "businessId":Number(businessId),
            "key":key
        })
        .done(function(data){
            console.log(data);
            var {code,totalCount,data} =data;
            pageList(20,totalCount,posPage);
            if(data.length==0){
                tip("无内容，请更换关键词搜索");
            }
            $('.positionRightList ul').empty();
            for(var i=0;i<data.length;i++){
                $('.positionRightList ul').append(`<li class="clearfix posClisk" data-id="${data[i].jobId}">
                    <div class="positionRightListImg">
                        <img src="${data[i].hrFace}" alt="" width="69" height="69">
                    </div>
                    <div class="positionRightListText">
                        <p class="title">${data[i].title}</p>
                        <p class="p1">${data[i].hrName} | ${data[i].hrCompany} | ${data[i].hrPosition}</p>
                        <p class="p2">公司规模  |  ${data[i].companyStaffNum}  |  ${data[i].companyFinance}</p>
                    </div>
                    <div class="positionRightListData">
                        <p class="style">${data[i].payStart}-${data[i].payEnd}</p>
                        <p class="data">${data[i].workCity}   |   ${data[i].workYear}   |   ${data[i].education}</p>
                    </div>
                </li>`);
                if(data[i].payEnd==0){
                    $('.positionRightListData .style').text("面议");
                }
            }
        })
    })
    //获取行业类别
    ajaxPackage(url+"/job/getRecruitJobList")
    .done(function(data){
        var {code,data} =data;
        for(var i= 0;i<data.length;i++){
           $('.tipWayList').after(`<span data-id="${data[i].id}">${data[i].title}</span>`)
        }
    });
    //根据标签搜索
    $(document).on('click','.posSearchPageFactor ul li span',function(){
        $(this).parents('li').find("span").removeClass("current");
        $(this).addClass("current");
        var workPayStart =$('.posSearchPageFactor ul li.emolument span.current').attr("workPayStart");
        var workPayEnd = $('.posSearchPageFactor ul li.emolument span.current').attr("workPayEnd");
        var workYear = $('.posSearchPageFactor ul li.exp span.current').attr("data-id");
        var education = $('.posSearchPageFactor ul li.edu span.current').attr("data-id");
        var businessId = $('.posSearchPageFactor ul li.tipWay span.current').attr("data-id");
        var cityId = $('#serchCity').attr('data');
        var key =$('#artSerchKey').val();
        ajaxPackage(url+"/job/getAllJobPage",{
            "toPage":1,
            "workPayStart":Number(workPayStart),
            "workPayEnd":Number(workPayEnd),
            "workYear":Number(workYear),
            "education":Number(education),
            "cityId":Number(cityId),
            "businessId":Number(businessId),
            "key":key
        })
        .done(function(data){
            var {code,totalCount,data} =data;
            pageList(20,totalCount,posPage);
            if(data.length==0){
                tip("无内容，请更换关键词搜索");
            }
            console.log(data);
            $('.positionRightList ul').empty();
            for(var i=0;i<data.length;i++){
                $('.positionRightList ul').append(`<li class="clearfix posClisk" data-id="${data[i].jobId}">
                    <div class="positionRightListImg">
                        <img src="${data[i].hrFace}" alt="" width="69" height="69">
                    </div>
                    <div class="positionRightListText">
                        <p class="title">${data[i].title}</p>
                        <p class="p1">${data[i].hrName} | ${data[i].hrCompany} | ${data[i].hrPosition}</p>
                        <p class="p2">公司规模  |  ${data[i].companyStaffNum}  |  ${data[i].companyFinance}</p>
                    </div>
                    <div class="positionRightListData">
                        <p class="style">${data[i].payStart}-${data[i].payEnd}</p>
                        <p class="data">${data[i].workCity}   |   ${data[i].workYear}   |   ${data[i].education}</p>
                    </div>
                </li>`);
                if(data[i].payEnd==0){
                    $('.positionRightListData .style').text("面议");
                }
            }
        })
    })
}
function posPage(num){
    var workPayStart =$('.posSearchPageFactor ul li.emolument span.current').attr("workPayStart");
    var workPayEnd = $('.posSearchPageFactor ul li.emolument span.current').attr("workPayEnd");
    var workYear = $('.posSearchPageFactor ul li.exp span.current').attr("data-id");
    var education = $('.posSearchPageFactor ul li.edu span.current').attr("data-id");
    var businessId = $('.posSearchPageFactor ul li.tipWay span.current').attr("data-id");
    var cityId = $('#serchCity').attr('data');
    var key =$('#artSerchKey').val();
    ajaxPackage(url+"/job/getAllJobPage",{
        "toPage":num,
        "workPayStart":Number(workPayStart),
        "workPayEnd":Number(workPayEnd),
        "workYear":Number(workYear),
        "education":Number(education),
        "cityId":Number(cityId),
        "businessId":Number(businessId),
        "key":key
    })
    .done(function(data){
        var {code,data} =data;
        $('.positionRightList ul').empty();
        for(var i=0;i<data.length;i++){
            $('.positionRightList ul').append(`<li class="clearfix posClisk" data-id="${data[i].jobId}">
                <div class="positionRightListImg">
                    <img src="${data[i].hrFace}" alt="" width="69" height="69">
                </div>
                <div class="positionRightListText">
                    <p class="title">${data[i].title}</p>
                    <p class="p1">${data[i].hrName} | ${data[i].hrCompany} | ${data[i].hrPosition}</p>
                    <p class="p2">公司规模  |  ${data[i].companyStaffNum}  |  ${data[i].companyFinance}</p>
                </div>
                <div class="positionRightListData">
                    <p class="style">${data[i].payStart}-${data[i].payEnd}</p>
                    <p class="data">${data[i].workCity}   |   ${data[i].workYear}   |   ${data[i].education}</p>
                </div>
            </li>`);
            if(data[i].payEnd==0){
                $('.positionRightListData .style').text("面议");
            }
        }
    })
}
//职位详情跳转
function posClisk(){
    $(document).on("click",".posClisk" ,function () {
        var id =$(this).attr("data-id");
        window.location.href=`positionDetails.html?jodId=${id}`;
    });
}
//职位详情
function positionDetails(){
    loginIs();
    var id =getUrl();//得到职位ID
     // 登录环信
    $('.posDetailsLeftTalkConBtn ,.posDetailsDataTalkBtn').click(function(){
        ajaxPackage(url+"/common/getUserSingInfo")
        .done(function(data){
            var {code,data} = data;
            if(code ==0){
                var userId =data.id;//用户ID
                var role =data.role;//用户角色
                // console.log(data);
                var json ={
                    "userId":Number(userId),
                    "otherUserId":Number(localStorage.hrId),
                    "objId":Number(id.jodId),
                    "openRole":Number(role),
                }
                // console.log(json);
                ajaxPackage(url+'/job/signPower/openChatting',json)
                    .done(function (data) {
                        var {code,data} =data;
                        if(code ==0){
                            window.location.href="person.html?jodId="+id.jodId;
                        }else {
                            tip("请检查登录状态");
                        }
                    })
            }else if(code ==1005){
                $('.loginBox ,.bg').show();
            }else if(code ==1){
                $('.loginBox ,.bg').show();
            }
        });
    });
    //获取职位想详情信息
    ajaxPackage(url+"/job/getJobDetails",{
        "id":Number(id.jodId)
    })
    .done(function(data){
        var {code,data} =data;
        // console.log(data);
        var DetailData=data.jobInfo;
        var hrId = DetailData.hrId;
        localStorage.hrId=hrId;
        $('.classTitle').text(DetailData.classTitle);
        if(DetailData.workYear==-1){
            $('.workYear').text("不限");
        }else{
            $('.workYear').text(`${DetailData.workYear}年`);
        }
        $('.educationStr').text(DetailData.educationStr);
        $('.workCity').text(DetailData.workCity);
        if(DetailData.payEnd<2){
            $('.moneyWork').text("面议");
        }else{
            $('.moneyWork').text(`${DetailData.payStart}-${DetailData.payEnd}K`);
        }
        $('.posDetailsDataTalkImg > img').attr("src",DetailData.face);
        $(".trueName").text(DetailData.trueName);
        $('.position').text(DetailData.position);
        $(".onlineState").text(DetailData.onlineState);
        $('.address').text(DetailData.companyName);
        $('.jobRequire').html(`<span>职业描述：</span><br>${DetailData.jobInfo}`);
        $('.jobHot').html(`<span>我们的福利：</span><br>${DetailData.jobHot}`);
        $('.jobaddress').html(`<span>公司地址：</span><br>${DetailData.address}`);
        for(var i=0 ;i<data.topList.length;i++){
            $('.posDetailsLeftHotList ul').append(`<li class="clearfix"><p class="name">${data.topList[i].title}</p><p class="num">${data.topList[i].countNum}个</p></li>`)
        }

    })
}
//登录判断
function loginIs(){
    ajaxPackage(url+"/common/getUserSingInfo")
    .done(function(data){
        var {code,data} = data;
        if(code ==0){
            $('.myPerImg img').attr("src",data.face);
            $('.myPer p').text(data.truename);
            $('.loginBox,.login').hide();
            $('.myPer').show();
            flag =true;
        }else if(code ==1005){
            $('.login').show();
            $('.myPer').hide();
            flag =false;
        }else if(code ==1){
            $('.login').show();
            $('.myPer').hide();
            flag =false;
        }
    });
}
//在线学院
function study() {
    loginIs();
    //加载课程模块
    ajaxPackage(url+"/courseNew/getCourseSpecialList")
        .done(function (data) {
            console.log(data)
        })
}
//聊天
function perTalk(){
    loginIs();
    var id =getUrl();
    //获取职位详情
    ajaxPackage(url+"/job/getJobDetails",{
        id : id.jodId
    })
    .done(function (data) {
        var {code,data} =data;
        var address =data.jobInfo.address;//地址
        var classTitle =data.jobInfo.classTitle;//职位名称
        var companyName =data.jobInfo.companyName;//公司名称
        var educationStr =data.jobInfo.educationStr;//学历
        var face =data.jobInfo.face;//聊天人头像
        var position =data.jobInfo.position;//hr职位
        var trueName = data.jobInfo.trueName;
        var id =data.jobInfo.hrId;
        var title=data.jobInfo.classTitle;
        $('.personConRightTalkDetailImg img').attr('src',face);
        $('.personConRightHead ul li').eq(2).text(trueName);//聊天人名字
        $('.personConRightTalkDetailData p').eq(0).text(`${trueName} | ${position}`);
        $('.personConRightTalkDetailData p').eq(1).text(`${data.jobInfo.workCity} | ${data.jobInfo.education}年 | ${educationStr}`);
        $('.personConRightTalkDetailData p').eq(2).text(`${companyName}`);
        $('.personConRightTalkDetailData p').eq(3).text(`沟通职位  ${classTitle}`);
        //新增联系人
        function addContacts() {
            var contactObj ={id:id,name:trueName,title:title,url:face};//拿到联系人数据
            //存入缓存
            if(localStorage.contact){//判断缓存是否存在
                var t=JSON.parse(localStorage.contact);//转成对象
                var len =t.userData.length;
                for(var i=0 ;i<len;i++){//调用对象的属性，并循环
                    if(t.userData[i].id ===id){//判断有没有相同的id。如果有就跳出循环
                        break;
                    }
                    if(i ==  len-1){
                        t.userData.unshift(contactObj);
                        localStorage.contact=JSON.stringify({userData:t.userData})
                    }

                }
            }else {
                var arr=[];
                arr.push(contactObj);
                var userDatas =JSON.stringify({userData:arr});
                localStorage.contact = userDatas;
            };
            var t=JSON.parse(localStorage.contact);
            //读取缓存
            for (var k=0;k<t.userData.length;k++){
                $('#side2 ul').append(`<li class="clearfix" data-id=${t.userData[k].id}>
                    <div class="personConLeftListImg">
                        <img src=${t.userData[k].url} alt="">
                    </div>
                    <div class="personConLeftListText">
                        <p class="talkName">${t.userData[k].name}</p>
                        <p class="record"></p>
                    </div>
                    <i>99</i>
                </li>`);
            }
            $('#side2 ul li').eq(0).addClass('current');
        }
        console.log(localStorage.contact);
        addContacts();
        // localStorage.clear();
        //填写职位信息
        var DetailData=data.jobInfo;
        $('.classTitle').text(DetailData.classTitle);
        if(DetailData.workYear==-1){
            $('.workYear').text("不限");
        }else{
            $('.workYear').text(`${DetailData.workYear}年`);
        }
        $('.educationStr').text(DetailData.educationStr);
        $('.workCity').text(DetailData.workCity);
        if(DetailData.payEnd<2){
            $('.moneyWork').text("面议");
        }else{
            $('.moneyWork').text(`${DetailData.payStart}-${DetailData.payEnd}K`);
        }
        $('.posDetailsDataTalkImg > img').attr("src",DetailData.face);
        $(".trueName").text(DetailData.trueName);
        $('.position').text(DetailData.position);
        $(".onlineState").text(DetailData.onlineState);
        $('.address').text(DetailData.companyName);
        $('.jobRequire').html(`<span>职业描述：</span><br>${DetailData.jobInfo}`);
        $('.jobHot').html(`<span>我们的福利：</span><br>${DetailData.jobHot}`);
        $('.jobaddress').html(`<span>公司地址：</span><br>${DetailData.address}`);
    })
   //登录环信
   ajaxPackage(url+"/common/getUserSingInfo")
    .done(function(data){
        var {code,data} = data;
        // console.log(data);
        if(code ==0){
            serchKeys("#serchKey","#side2 ul li");//开启搜索功能
            var face =data.face;
            var tedl =data.tel;
            var wx = data.weixin;
            var name =data.truename;
            $('.personConLeftHeadImg img').attr('src',face);
            $('.personConLeftHeadText').text(name);
            if(data.role==0){
                console.log("我是个人版");
            }else{
                console.log("我是企业版");
            }
            var uesrId = data.id;
            var userName =uesrId+"_"+data.role;
            var password = hex_md5(uesrId+"D734%$0Cx!*#@");
            var options = {
                apiUrl: WebIM.config.apiURL,
                user: userName,
                pwd: password,
                appKey: WebIM.config.appkey
            };
            conn.open(options);
        }else{
            // $('.loading').hide();
            // tip("登录已失效，请重新登录");
        }
    });
}
