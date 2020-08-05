var notify = new iNotify({
  effect: "scroll",
  message: "您有新消息..."
})
var ChatResolver = {
    type: {
        inMessage: "inMessage",
        outMessage: "outMessage",
        broadcast: "broadcast",
    },
    render: function(type, message) {
        switch (type) {
            case this.type.inMessage:
                renderInMessage(message)
                break
            case this.type.outMessage:
                renderOutMessage(message)
                break
            case this.type.broadcast:
                renderBroadcast(message)
                break
        }
    },
    renderHistory: function(message) {
        renderHistoryRecord(message)
    },
    renderBroadcast: function(message) {
        $("#chat_service_status_msg").text(message);
    },
    renderHtml: function(html) {
        appendHtml(html)
    },
    toScroll: function() {
        fitScroll()
    }
}
var revocationMessage = "客服撤回一条消息"

function renderInMessage(message) {
    var messageType = message.type 
    switch (messageType) {
        case "BUILD_CHAT":
            customer.cid = message.cid
            renderInMessage.buildChat(message)
            break
        case "MESSAGE":
            renderInMessage.message(message)
            break
        case "TRANSFER":
            renderInMessage.transfer(message)
            break
        case "BROADCAST":
            renderInMessage.broadcast(message)
            break
        case "CLOSE_CHAT":
            renderBroadcast(Constant.close_tip)
            break
        case "REVOCATION":
            renderRevocation(message)
            break
        case "EVALUATE":
            $("#option_box").show()
            break
    }
    
    if(notify.open && messageType !== 'PONG') {
      notify.start()
    }
}

// 创建会话消息
renderInMessage.buildChat = function(message) {
    var bodyType = message.body.type
    var appendInner
    var content
    switch (bodyType) {
        case "BUILDING_CHAT":
            renderBroadcast(message.body.content)
            break
        case "WAITTING":
            renderBroadcast(Constant.waitting_tip.replace("{0}", message.body.content))
            break
        case "SUCCESS":
            try {
                var buildChatInfo = JSON.parse(message.body.content)
                customer.tmb = buildChatInfo.tmb
                customer.skn = buildChatInfo.skn
            } catch(e) {
                // ignore
            }
            renderBroadcast(Constant.service_info.replace("{0}", message.from.uid))
            break
        case "TEAM_GREET":
            content = replaceUrl(Emoji.face.toEmoji(message.body.content))
            appendInner = '<div class="service-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                message.datetime + '</span><b>' + 
                (customer.tmb || "") + '</b><b class="left-space">' +
                message.from.uid + '</b></div><div class="chat-body">' +
                content + '</div></div></div>'
            break
        case 'WAITER_GREET':
          content = replaceUrl(Emoji.face.toEmoji(message.body.content))
          appendInner = '<div class="service-chat clearfix">' +
              '<div class="portrait icons"></div><div class="container">' +
              '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
              message.datetime + '</span><b>' + 
              (customer.tmb || "") + '</b><b class="left-space">' +
              message.from.uid + '</b></div><div class="chat-body">' +
              content + '</div></div></div>'
            break
    }
    appendChatBox(message, appendInner)
}

// 会话消息
renderInMessage.message = function(message) {
    var content
    var appendInner
    var bodyType = message.body.type
    switch (bodyType) {
        case "TEXT":
            content = EscapeSequence.filterHtmlJsSpaceEnter(message.body.content)
            appendInner = '<div class="service-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                message.datetime + '</span><b>' + 
                (customer.tmb || "") + '</b><b class="left-space">' +
                message.from.uid + '</b></div><div class="chat-body">' +
                replaceUrl(Emoji.face.toEmoji(content)) + '</div></div></div>'
            break
        case 'TIMEOUT_TIP':
            appendInner = '<div class="robot-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                Common.dateFormat() + '</span><b>客服助手</b></div><div class="chat-body">' +
                Emoji.face.toEmoji(message.body.content) + '</div></div></div>'
            break
        case 'TIMEOUT_CLOSE':
            appendInner = '<div class="robot-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                Common.dateFormat() + '</span><b>客服助手</b></div><div class="chat-body">' +
                Emoji.face.toEmoji(message.body.content) + '</div></div></div>' 
            renderBroadcast(Constant.close_tip)
            break
        case 'IMAGE':
            appendInner = '<div class="service-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                message.datetime + '</span><b>' +
                (customer.tmb || "") + '</b><b class="left-space">' +
                message.from.uid + '</b></div><div class="chat-body">' +
                Common.createImgHtml(message.body.content) + '</div></div></div>'
            break
        case 'LOGISTICS':
            appendInner = '<div class="service-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                message.datetime + '</span><b>' +
                (customer.tmb || "") + '</b><b class="left-space">' +
                message.from.uid + '</b></div><div class="chat-body">' +
                createLogistics(message.body.content) + '</div></div></div>'
            break
        case 'GOODS':
            appendInner = '<div class="service-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                message.datetime + '</span><b>' +
                (customer.tmb || "") + '</b><b class="left-space">' +
                message.from.uid + '</b></div><div class="chat-body">' +
                createGoods(message.body.content) + '</div></div></div>'
            break
        case 'ORDER':
            appendInner = '<div class="service-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                message.datetime + '</span><b>' +
                (customer.tmb || "") + '</b><b class="left-space">' +
                message.from.uid + '</b></div><div class="chat-body">' +
                createOrders(message.body.content) + '</div></div></div>'
            break
        case 'TIP':
        case 'ROBOT':
            appendInner = '<div class="robot-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                Common.dateFormat() + '</span><b>客服助手</b></div><div class="chat-body">' +
                Emoji.face.toEmoji(message.body.content) + '</div></div></div>'
            break;
        default:
            appendInner = '<div class="robot-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                Common.dateFormat() + '</span><b>客服助手</b></div><div class="chat-body">' +
                Emoji.face.toEmoji(message.body.content) + '</div></div></div>' 
            renderBroadcast(Constant.close_tip)
    }
    appendChatBox(message, appendInner)
}

renderInMessage.transfer = function(message) {
    var appendInner
    var bodyType = message.body.type
    if (bodyType === 'SUCCESS') {
        renderBroadcast(Constant.service_info.replace("{0}", message.from.uid))
        appendInner = '<div class="robot-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                Common.dateFormat() + '</span><b>客服助手</b></div><div class="chat-body">已为您转接客服工号：' +
                message.from.uid + '， 请输入您要咨询的问题。</div></div></div>'
        try {
            var buildChatInfo = JSON.parse(message.body.content)
            customer.tmb = buildChatInfo.tmb
            customer.skn = buildChatInfo.skn
        } catch(e) {
            // ignore
        }
    }
    appendChatBox(message, appendInner)
}

renderInMessage.broadcast = function(message) {
    var bodyType = message.body.type
    if (bodyType === 'WAITTING_NO') {
        renderBroadcast(Constant.waitting_tip.replace("{0}", message.body.content))
    }
}

function renderOutMessage(message) {
    var showContainer
    switch(message.type) {
        case "TEXT":
            showContainer = '<div class="user-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                Common.dateFormat() + '</span><b>我</b></div><div class="chat-body">' +
                replaceUrl(Emoji.face.toEmoji(message.content)) + '</div></div></div>'
            break
        case "IMAGE":
            showContainer = '<div class="user-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                Common.dateFormat() + '</span><b>我</b></div><div class="chat-body">' +
                Emoji.face.toEmoji(message.content) + '</div></div></div>'
            break
        case "ORDER":
            showContainer = '<div class="user-chat clearfix">' +
                '<div class="portrait icons"></div><div class="container">' +
                '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                Common.dateFormat() + '</span><b>我</b></div><div class="chat-body">' +
                createOrders(message.content) + '</div></div></div>'
            break
    }
    appendChatBox(message, showContainer)
}

function renderBroadcast(message) {
    $("#chat_service_status_msg").text(message);
}

function renderRevocation(message) {
    var pid = message.pid
    $('div[pid=' + pid + ']').html("<div class='revocation'>" + revocationMessage + "</div>")
}

function renderHistoryRecord(message) {
    if (message) {
        var content = resolverHtyMessage(message)
        var appendInner
        switch (message.ownerType) {
            case '1':
                appendInner = '<div class="user-chat clearfix">' +
                    '<div class="portrait icons"></div><div class="container">' +
                    '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                    message.createTime + '</span><b>我</b></div><div class="chat-body">' +
                    content + '</div></div></div>'
                break
            case '2':
                appendInner = '<div class="service-chat clearfix">' +
                    '<div class="portrait icons"></div><div class="container">' +
                    '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                    message.createTime + '</span><b>'+
                    message.briefName + '</b><b class="left-space">' +
                    message.waiterCode + '</b></div><div class="chat-body">' +
                    content + '</div></div></div>'
                break
            default:
              if(message.messageType == '5' || message.messageType == '9') {
                appendInner = '<div class="service-chat clearfix">' +
                  '<div class="portrait icons"></div><div class="container">' +
                  '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                  message.createTime + '</span><b>'+
                  message.briefName + '</b><b class="left-space">' +
                  message.waiterCode + '</b></div><div class="chat-body">' +
                  content + '</div></div></div>'
              } else {
                appendInner = '<div class="robot-chat clearfix">' +
                  '<div class="portrait icons"></div><div class="container">' +
                  '<div class="arrow icons"></div><div class="chat-head ell"><span>' +
                  message.createTime + '</span><b>客服助手</b></div><div class="chat-body">' +
                  content + '</div></div></div>'
              }
        }
        $("#msg_box").prepend(appendInner);
    }
}

function resolverHtyMessage(message) {
    var content
    switch (message.messageType) {
        case '2':
            content = createHistoryImgHtml(message.messages)
            break
        case '10':
            content = createGoods(message.messages)
            break
        case '11':
                content = createOrders(message.messages)
                break
        case '12':
            content = createLogistics(message.messages)
            break
        default:
            content = replaceUrl(Emoji.face.toEmoji(message.messages))
    }
    return content
}

function createLogistics(message) {
    var o = JSON.parse(message)
    var html = '<div><div style="padding: 2px 0 8px 0; font-size: 13px;"><span>以下是最新物流信息：<span></div>'
    for (var i = 0; i < o.length; i++) {
        html += '<div><span> ' + o[i].lgtime + ' </span></div>' +
            '<div><span> ' + o[i].lgdesc + ' </span></div>'
    }
    html += '</div>'
    return html
}

function createGoods(message) {
    var o = JSON.parse(message)
    let html 
    if (isMobile == 0) {
       html = '<a href="' + o.wapUrl + '" target="_blank">' + o.name + '</a>'
    } else {
       html = '<a href="' + o.pcUrl + '" target="_blank">' + o.name + '</a>'
    }
    return html
}

function createOrders(message) {
    let o = JSON.parse(message)
    // let o = message;
    let html = `<div class="ordercard">
                    <ul class="sendPrdUl">
                        <li class="prdCodeLi">
                            <div>
                                <label style="padding-left: 8px;">订单号:</label>
                                <span style="margin-left: -5px;">${o.orderCode}</span><br>
                                <label style="padding-left: 8px;">下单时间:</label>
                                <span style="margin-left: -5px;">${o.orderTime}</span>
                                <span style="float:right">
                                    <b>${o.orderStatusInfo}</b>
                                </span>
                            </div>
                        </li>
                        <li class="prdLi">
                            <div class="img">
                                <img src="${o.prdInfo.prdImgUrl}" alt="">
                            </div>
                            <div class="prdLiDiv">
                                <a href="${o.prdInfo.prdDetailUrl}" title="${o.prdInfo.prdName}" target="_blank" class="prdNameP">${o.prdInfo.prdName}</a>
                                <p style="color: #999;">
                                    <span>商品编号：</span>
                                    <span style="margin-left: -0.5rem;">${o.prdInfo.prdCode}</span>
                                </p>  
                                <p class="prdInfoP">
                                    <span>数量：</span>
                                    <span style="padding-right: 8px; margin-left: -8px;">${o.prdInfo.prdAcount}</span>
                                    <b>￥${o.prdInfo.prdPrice}</b>
                                </p>
                            </div>
                        </li>
                        <li class="prdAmountLi">
                            <div style="position: relative">
                                <span>共</span>
                                <span style="margin-left: -4px;">${o.orderAcount}</span>
                                <span style="padding-right: 8px; margin-left: -4px;">件</span>
                                <span>订单金额：</span>
                                <b style="color: #e2231a; margin-left: -12px;">￥${o.orderAmount}</b>
                            </div>
                        </li>
                    </ul>
                </div>`.replace(/\n/gm,"");

    return html;

}

function createHistoryImgHtml(imgurl) {
    return '<img src="' + imgurl + '" style="max-width: 100%; max-height: 300px;" onload="conFitScroll()"/>'


}

function appendHtml(html) {
    $("#msg_box").append(html)
    fitScroll()
}

function appendChatBox(message, html) {
    if (html) {
        var pid = message.pid
        if (pid) {
            html = '<div class="record" pid="' + pid + '" >' + html + '</div>'
        }
        $("#msg_box").append(html)
    }
    fitScroll()
}

function fitScroll() {
    var h = $("#msg_box").height() - $("#chatDiv").height()
    if (h > 0) {
        $("#chatDiv").scrollTop(h + 40);
    }
}

function replaceUrl(msg) {
    var reg = /((((http?|https?):(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gi;
    var result = msg.replace(reg, function (item) {
        var content = item
        if (item.length > 4 && item.substr(0, 4) !== 'http') {
          item = "//" + item
        }
        return '<a class="custom-link" href="' + item + '" target="_blank">' + content + '</a>';
    });
    return result;
}

function replaceImgUrl(msg) {
    var arr = [];
    str = str.replace(/(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-\.\/?%&=]*)?/gi,function (s) {
        arr.push(s);
        return "\x01";
    });
    str = str.replace(/(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-\.\/?%&=]*)?/g,function (s,a) {
        return '<a class="custom-link" href="' + s + '" target="_blank">' + s + '</a>';
    });
    str = str.replace(/\x01/g,function (s) {
        return arr.shift();
    });
}