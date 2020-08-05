/**
 * @author pengzq
 * @since 2019.06.03
 * @version v1.0
 */
var WsClient = function(opts) {
    var wsPING
    var ws
    var customer = opts.customer
    var isError = false
    var isClose = true

    connect()

    function connect() {
        var connectPacket = {
            type: "AUTH",
            ts: "WEBSOCKET",
            from: {
                idy: "CUSTOMER"
            },
            body: {
                type: "LOGIN"
            }
        }
        var url = opts.url + "?packet=" + JSON.stringify(connectPacket) + "&t=" + new Date().getTime()

        ws = new WebSocket(url)

        wsEventHandler()
        bindInputMessageBox()
    }

    function wsEventHandler() {
        ws.onopen = function() {
            isError = false
            ChatResolver.render(ChatResolver.type.broadcast, Constant.build_success)
            clearInterval(wsPING)
            wsPING = setInterval(function() {
                var pingPacket = {
                    type: 'PING',
                    ts: 'WEBSOCKET',
                    body: {
                        type: 'TEXT',
                        content: "PING"
                    }
                }
                doSend(pingPacket)
            }, 30000)
        }

        ws.onmessage = function(data) {
            data = JSON.parse(data.data)
            if (data.type == 'RE_LOGIN') {
                isClose = true
                clearInterval(wsPING)
                ChatResolver.renderBroadcast("已在其他打开咨询，当前会话被关闭")
            } else {
                ChatResolver.render(ChatResolver.type.inMessage, data)
            }
        }

        ws.onerror = function(data) {
            isError = true
            ChatResolver.render(ChatResolver.type.broadcast, "糟糕，网络错误，工程师正在维护中...")
        }

        ws.onclose = function() {
            if (isClose) {
                return
            }
            if (!isError) {
                ChatResolver.render(ChatResolver.type.broadcast, "糟糕，网络连接断开")
            }
            reconnect()
        }
    }

    function bindInputMessageBox() {
        $(document).delegate("#message_area", "keydown", function(event) {
            if (!(event.ctrlKey || event.metaKey || event.altKey)) {
                $("#message-area").focus()
            }
            if (event.which === 13) {
                $("#send_msg_btn").click();
                event.preventDefault()
                return false
            }
        })

        $("#send_msg_btn").on("click", function() {
            var message = $("#message_area").val()
            if(message === ''){
                Pdialog.showDialog({ content: "消息不能为空" })
                return false
            }
            if(message && message.length > 300){
                Pdialog.showDialog({ content: "消息不能超过300字" })
                return false
            }
            if (message && message.length <= 300) {
                $("#message_area").val("")
                message = EscapeSequence.filterHtmlJsSpaceEnter(message)
                if (isMobile === 1) {
                    $("#message_area").focus()
                } else {
                    $("#message_area").blur()
                }
                sendMessage(message, 'TEXT')
                ChatResolver.render(ChatResolver.type.outMessage, { content: message, type: 'TEXT' })
            }
            event.preventDefault()
            return false
        })
    }

    function sendMessage(message, bodyType) {
        var sendPacket = {
            type: 'MESSAGE',
            ts: 'WEBSOCKET',
            from: {
                uid: customer.cc,
                name: customer.cn,
                idy: "CUSTOMER"
            },
            body: {
                type: bodyType,
                content: message
            }
        }
        doSend(sendPacket)
    }

    function doSend(packet) {
        if (packet) {
            if (ws.readyState === 1) {
                packet.pid = Common.getPid()
                packet.to = { idy: 'WAITER' }
                ws.send(JSON.stringify(packet))
            } else {
                reconnect()
            }
        }
    }

    function reconnect() {
        if (ws.readyState === 3) {
            clearInterval(wsPING)
            setTimeout(connect, 5000)
        }
    }

    return {
        sendImg: function(img, message, type) {
            sendMessage(message, type)
            ChatResolver.render(ChatResolver.type.outMessage, { content: img, type: 'IMAGE' })
        },
        sendMsg: function(message, type) {
            sendMessage(message, type)
            ChatResolver.render(ChatResolver.type.outMessage, { content: message, type: type })
        },
        close: function() {
            if (ws.readyState == 1) {
                ws.close()
            }
        }
    }
}