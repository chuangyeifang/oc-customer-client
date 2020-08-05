var customer
var io
var isMobile = 1
var ioType = window.WebSocket ? true : false

$(function() {
    // initWindon()
    document.domain = Config.domain
    auth()
})


function auth() {
    var urlParams = Common.getUrlParams()
    var ttc = urlParams.ttc ? urlParams.ttc : 1
    var skc = urlParams.skc
    var buc = urlParams.buc
    var gc = urlParams.gc
    
    var params = {
        ttc: ttc,
        skc: skc,
        buc: buc,
        gc: gc,
        device: isMobile,
        origin: 1,
        io: ioType ? "ws" : "poll"
    }
    Request.jsonp(Api.auth, params, false, function(res) {
        switch (res.rc) {
            // 成功
            case 0:
                customer = res.data;
                buildChat(customer);
                initChat();
                Chat.startChat();
                if(res.skn && res.skn.indexOf('EFF') !== -1){
                    params.ttc = 3
                }
                break;
            // 需要登录
            case 1:
                var encodeURISearch = encodeURIComponent(window.location.href) //编码地址
                res.data && res.data.loginUrl
                ? window.location.href = res.data.loginUrl + '&ru=' + encodeURISearch
                : Pdialog.showDialog({ content: res.rm })
                break;
            // 非工作时间
            case 2:
                initChat();
                var tipMessage = ''
                res.data && res.data.offlineMsg ? tipMessage = res.data.offlineMsg : tipMessage = res.rm
                Pdialog.showDialog({ content: tipMessage })
                $("#chat_service_status_msg").text(tipMessage);
                break;
            // 无法正确路由到skc
            case 3:
              var host = window.location.host
              window.location.href = '//' + host
              break
            case 5:
                $('.service-panel').hide()
                Pdialog.showDialog({ content: "由于在咨询过程中，咨询内容包含不合法信息，已暂时限制咨询请求！" })
                break;
            default:
                $('.service-panel').hide()
                Pdialog.showDialog({ content: "初始化信息失败，请重试！" })
                break;
        }
    }, function(res) {
        $('.service-panel').hide()
        Pdialog.showDialog({ content: "初始化信息失败，请重试！" })
    })
}

function buildChat(customer) {
    notify.open = true
    if (ioType) {
        io = WsClient({ url: Config.ws + '/ws.io', customer: customer })
    } else {
        io = HpClient({ url: Config.poll + '/poll.io', customer: customer })
    }
}