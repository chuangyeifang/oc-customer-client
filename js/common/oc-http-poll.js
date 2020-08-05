/**
 * @author pengzq
 * @since 2019.06.03
 * @version v1.0
 */
var HpClient = function(opts) {
    var customer = opts.customer
    opts.active = false

    connect()

    function connect() {
        var connectPacket = {
            type: 'AUTH',
            ts: 'POLLING',
            ttc: customer.ttc,
            skc: customer.skc,
            skn: customer.skn,
            gc: customer.gc,
            from: {
                idy: "CUSTOMER"
            },
            body: {
                type: 'LOGIN'
            }
        }
        doSend(connectPacket, function(res) {
            initEventHandler()
        })
    }

    function initEventHandler() {
        ChatResolver.render(ChatResolver.type.broadcast, Constant.build_success)
        poll()
        opts.active = true
        bindMessageElement()
    }

    function poll() {
        var pollPacket = {
            type: "POLL",
            ts: 'POLLING',
            ttc: customer.ttc,
            skc: customer.skc,
            skn: customer.skn,
            gc: customer.gc,
            to: {
                idy: "WAITER"
            },
            from: {
                uid: customer.cc,
                name: customer.cn,
                idy: "CUSTOMER"
            },
            body: {
                type: "TEXT"
            }
        }
        $.ajax({
            type: "GET",
            url: opts.url,
            data: { packet: JSON.stringify(pollPacket), t: new Date().getTime() },
            dataType: 'json',
            xhrFields: { withCredentials: true },
            success: function(res) {
                if (res && res instanceof Array) {
                    for (var i = 0; i < res.length; i++) {
                        ChatResolver.render(ChatResolver.type.inMessage, res[i])
                    }
                }
                if (opts.active) {
                    setTimeout(poll(), 1000)
                }
            },
            error: function(res) {
                console.log("请求失败： " + res)
            }
        })
    }

    var bindMessageElement = function() {
        $(document).delegate("#message_area", "keydown", function(event) {
            if (!(event.ctrlKey || event.metaKey || event.altKey)) {
                $("#message-area").focus()
            }
            if (event.which === 13) {
                var message = ''
                message = $("#message_area").val()
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
            }
        })

        $(document).delegate("#send_msg_btn", "click", function() {
            var message = ''
            message = $("#message_area").val()
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
            ts: 'POLLING',
            ttc: customer.ttc,
            skc: customer.skc,
            skn: customer.skn,
            gc: customer.gc,
            to: {
                idy: 'WAITER'
            },
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
        doSend(sendPacket, function(res) {
            console.log("消息发送成功!" + JSON.stringify(sendPacket))
        })
    }

    function doSend(packet, succ, fail) {
        if (packet) {
            packet.pid = Common.getPid()
            $.ajax({
                type: "GET",
                url: opts.url,
                data: { packet: JSON.stringify(packet), t: new Date().getTime()},
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: function(res) {
                    succ(res)
                },
                error: function(res) {
                    fail && fail instanceof Function && fail(res)
                    console.log("发送消息失败：{}", JSON.stringify(res))
                }
            })
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
            opt.active = false
            var closePacket = {
                type: 'CLOSE',
                ts: 'POLLING',
                ttc: customer.ttc,
                skc: customer.skc,
                skn: customer.skn,
                gc: customer.gc,
                to: {
                    idy: 'WAITER'
                },
                from: {
                    uid: customer.cc,
                    name: customer.cn,
                    idy: "CUSTOMER"
                }
            }
            doSend(closePacket, function(res) {
                console.log("关闭!")
            })
        }
    }
}