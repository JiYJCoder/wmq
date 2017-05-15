//链接环信
var conn = new WebIM.connection({
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: WebIM.config.isAutoLogin,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions
});
conn.listen({
    onOpened: function ( message ) {          //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
        $('.loading,.bg').hide();
        console.log("链接成功，可以开始聊天")
    },
    onClosed: function ( message ) {

    },         //连接关闭回调
    onTextMessage: function ( message ) {
        console.log(message);
    },    //收到文本消息
    onEmojiMessage: function ( message ) {

    },   //收到表情消息
    onPictureMessage: function ( message ) {

    }, //收到图片消息
    onCmdMessage: function ( message ) {

    },     //收到命令消息
    onAudioMessage: function ( message ) {

    },   //收到音频消息
    onLocationMessage: function ( message ) {

    },//收到位置消息
    onFileMessage: function ( message ) {

    },    //收到文件消息
    onVideoMessage: function (message) {
        var node = document.getElementById('privateVideo');
        var option = {
            url: message.url,
            headers: {
              'Accept': 'audio/mp4'
            },
            onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
                console.log('File down load error.')
            }
        };
        WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function ( message ) {

    },       //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function ( message ) {

    },         //处理好友申请
    onInviteMessage: function ( message ) {
        
    },  //处理群组邀请
    onOnline: function () {
    },                  //本机网络连接成功
    onOffline: function () {
        tip("链接不到网络，请刷新");
    },                 //本机网络掉线
    onError: function ( message ) {
        tip("链接失败");
        // window.location.reload();
    },          //失败回调
    onBlacklistUpdate: function (list) {       //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    }
});
$(function(){
    var sendPrivateText = function () {
        var id = conn.getUniqueId();                 // 生成本地消息id
        var msg = new WebIM.message('txt', id);      // 创建文本消息
        msg.set({
            msg: 'message content',                  // 消息内容
            to: '106444_0',                          // 接收消息对象（用户id）
            roomType: false,
            success: function (id, serverMsgId) {
                console.log('send private text Success');
            }
        });
        msg.body.chatType = 'singleChat';
        conn.send(msg.body);
    };
    $('.personConRightChatBoxBtn').click(function () {
        sendPrivateText();
    })
})