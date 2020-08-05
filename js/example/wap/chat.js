var suggest = {}

var ChatWap = {
    startChat: function () {
        initLoadGoods()
        initLoadRecommend()
        initEvent()
        initOrderList()
    }
}

var timer_comment

var orderCode,
    arrOrder = [],
    pageNum = 1,
    off_on = false, //分页开关(滚动加载方法 1 中用的)
    timers = null; //定时器(滚动加载方法 2 中用的)

function showAndhideTips(content) {

    $(".s-tips").html(content);
    $(".m-sbt-suc").show();

    if (timer_comment) {
        clearTimeout(timer_comment)
    }
    timer_comment = setTimeout(function () {
        $(".s-tips").html("")
        $(".m-sbt-suc").hide()
    }, 1500);
}

function resetSuggest() {
    $("#option_box").hide()
    $(".chat-menu-footer").hide()
    $("#inner_sug").val("");
    $(".ay-star-ul li").css("background-image", "url('/images/chatwap/ic.png')")
}

function initEvent() {
    $(document).click(function (e) {
        // 判断除“footerActionBar”以外->隐藏
        if (e.target.id !== 'footerActionBar') {
            $("#emoji_container").hide();
            $("#emoji_container").find('.emoji-inner').hide();
            $(".chat-menu-footer").hide() //底部菜单栏
        }
    })

    // 底部区域-点击事件
    $('#footerActionBar').on('click', function (e) {
        //阻止当前区域->冒泡
        Common.stopPropagation(event)

        // 判断表情内容是否为show
        if ($("#emoji_container").is(':visible')) {
            $("#emoji_container").show()
        }
        // 判断底部菜单栏是否为show
        if ($(".chat-menu-footer").is(':visible')) {
            $(".chat-menu-footer").show()
        }
    });

    // 初始化表情内容
    $(".click-emoji").on('click', function () {
        $("#emoji_container").toggle()
        $("#emoji_container .emoji-inner").show()
        //表情内容显示<-->底部菜单栏隐藏
        $(".chat-menu-footer").hide()
    })

    // 初始化+事件
    $("#input-add-field").on('click', function () {
        $(".chat-menu-footer").toggle()
        $("#emoji_container").hide()
    })

    // 显示评论
    $("#click-star").on('click', function () {
        if (customer.cid == suggest.chatId) {
            showAndhideTips("已评价！");
            return false;
        }
        if (!customer.cid) {
            showAndhideTips("请咨询后再评价！");
            return false;
        }
        $("#option_box").show();
        $(".chat-menu-footer").hide();
    })

    //开始评价
    $(".ay-star-ul li").unbind("click").bind("click", function () {
        var index = $(this).index();
        suggest.opinion = index + 1;
        $(".ay-star-ul").find("li").css("background-image", "url('/images/chatwap/ic.png')");
        for (var i = 0; i <= index; i++) {
            if (index < 3) {
                $('.textarea-div').css({
                    'display': 'block'
                });
            } else {
                $('.textarea-div').css({
                    'display': 'none'
                });
            }
            $(".ay-star-ul").find("li").eq(i).css("background-image", "url('/images/chatwap/iced.png')");
        }
    });

    // 评论框的关闭按钮
    $(".ay-ms-cut").on('click', function (e) {
        resetSuggest();
    })

    // 提交评价
    $("#submit_sug").on('click', function () {
        if (customer.cid == suggest.chatId) {
            showAndhideTips("已评价！");
            resetSuggest();
            return false;
        }
        if (!customer.cid) {
            showAndhideTips("请咨询后再评价！");
            resetSuggest();
            return false;
        }

        suggest.suggest = $("#inner_sug").val(); //建议
        suggest.chatId = customer.cid; //客服id

        if (!suggest.opinion || (!suggest.suggest && suggest.opinion && (suggest.opinion == "1" || suggest.opinion == "2"))) {
            showAndhideTips("请选择或者输入建议！");
            return false;
        }

        if (suggest.opinion && (suggest.opinion == "1" || suggest.opinion == "2") && $.trim(suggest.suggest).length < 10) {
            showAndhideTips("请填写您的建议且建议内容至少10个字!");
            $("#inner_sug").focus();
            return false;
        }

        //转义html to encode
        if ($.trim(suggest.suggest)) {
            suggest.suggest = EscapeSequence.filterHtmlJsSpaceEnter(suggest.suggest)
        }

        if (suggest.chatId && suggest.opinion) {
            Request.jsonp(Api.opinion, suggest, true, function (res) {
                if (res && res.rc == 0) {
                    suggest.opinion = undefined;
                    showAndhideTips("评价成功！");
                } else {
                    showAndhideTips(res.rm);
                    resetSuggest();
                    return false;
                }
            })
        } else {
            showAndhideTips("请完善评价信息！");
        }
    })

    //当输入框获取焦点，显示发送按钮
    $("#message_area").focus(function (e) {
        if ($("#emoji_container").is(':visible')) {
            $("#emoji_container").show()
        }
        if ($(".chat-menu-footer").is(':visible')) {
            $(".chat-menu-footer").show()
        }
        $(".chat-menu-footer").hide()
        $("#emoji_container").hide()

        var messageValue = $("#message_area").val()
        if (messageValue) {
            $("#input-add-field").hide()
            $("#send_msg_btn").show()
        } else {
            $("#send_msg_btn").hide()
            $("#input-add-field").show()
        }
    })

    //当输入框失去焦点，显示发送按钮
    $("#message_area").blur(function () {
        var messageValue = $("#message_area").val()
        if (messageValue) {
            $("#input-add-field").hide()
            $("#send_msg_btn").show()
        } else {
            $("#send_msg_btn").hide()
            $("#input-add-field").show()
        }
    })

    $('#message_area').on('keyup', function () {
        var messageValue = $("#message_area").val()
        if (messageValue) {
            $("#input-add-field").hide()
            $("#send_msg_btn").show()
        } else {
            $("#send_msg_btn").hide()
            $("#input-add-field").show()
        }
    })

    //点击图片事件
    $("#set-file").unbind("click").bind('click', function () {
        $("#upload_file").click();
        return false;
    });

    // 上传图片
    $(document).delegate("#upload_file", "change", function () {
        var fileObj = $(this)
        if (fileObj.val().length < 1) {
            return
        }
        var file = fileObj[0].files['0']
        if (file) {
            if ((file.type).indexOf("image/") == -1) {
                Pdialog.showDialog({
                    content: "请上传图片"
                })
                return
            }
            if (((file.size).toFixed(2)) > (6 * 1024 * 1024)) {
                Pdialog.showDialog({
                    content: "请上传小于6M的图片"
                })
                return
            }
            //获取照片方向角属性，用户旋转控制
            EXIF.getData(file, function () {
                EXIF.getAllTags(this)
                Orientation = EXIF.getTag(this, 'Orientation')
            });

            var oReader = new FileReader()
            oReader.onload = function (e) {
                var image = new Image()
                image.src = e.target.result
                image.onload = function () {
                    var expectWidth = this.naturalWidth
                    var expectHeight = this.naturalHeight

                    if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                        expectWidth = 800
                        expectHeight = expectWidth * this.naturalHeight / this.naturalWidth
                    } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                        expectHeight = 1200
                        expectWidth = expectHeight * this.naturalWidth / this.naturalHeight
                    }
                    var canvas = document.createElement("canvas")
                    var ctx = canvas.getContext("2d")
                    canvas.width = expectWidth
                    canvas.height = expectHeight
                    ctx.drawImage(this, 0, 0, expectWidth, expectHeight)
                    var base64 = null
                    base64 = canvas.toDataURL("image/jpeg", 0.8)
                    Common.uploadImgB64(Api.uploadImgb64, base64, function (res) {
                        if (res.rc == 0) {
                            var img = Common.createImgHtml(res.imgurl, false)
                            io.sendImg(img, res.imgurl, "IMAGE")
                        } else {
                            showAndhideTips(res.msg)
                        }
                        $("#set-file").data("isUploading", false)
                        $("#upload_file").after($("#upload_file").clone().val('')).remove()
                    })
                }
            }
            oReader.readAsDataURL(file);
        }
    })

    // 点击我的订单
    $('.marks_info .mark_order').on('click', function (e) {
        $(".marks_info").parents(".app-main").siblings(".myorder").show()
        $(".marks_info").parents('.app-main').css("opacity", "0.1")

    });

    $('.myorder .close_myorder').on('click', function (e) {
        $(".marks_info").parents(".app-main").siblings(".myorder").hide()
        $(".marks_info").parents('.app-main').css("opacity", "1")

    });

    // 发送链接
    $('.myorder_main').on('click', 'ul li .send-order', function (e) {
        let index = $(this).parent().parent().parent().parent().index();
        let prdindex = $(this).attr('data-index')
        let data = arrOrder[index];
        let prddata = arrOrder[index].prdInfoList[prdindex];
        let sendData = {
            "orderCode": data.orderId,
            "orderTime": data.orderTime,
            "orderAmount": data.orderAmount,
            "orderStatusInfo": data.orderStatusInfo,
            "prdInfo": {
                "prdImgUrl": prddata.prdImgUrl,
                "prdName": prddata.prdName,
                "prdAcount": prddata.prdAcount,
                "prdPrice": prddata.prdPrice,
                "prdDetailUrl": prddata.prdDetailUrl,
                "prdCode": prddata.prdCode,
            },
            "orderAcount": data.prdInfoList.length

        }
        io.sendMsg(JSON.stringify(sendData), 'ORDER');
        $(".marks_info").parents(".app-main").siblings(".myorder").hide()
        $(".marks_info").parents('.app-main').css("opacity", "1")

    })

    // 查看物流
    $('.myorder_main').on('click', 'ul li .view', function (e) {
        let index = $(this).parents().parents().index();
        let data = arrOrder[index];
        if (!$(this).hasClass('active')) {

            $(this).addClass('active').parents().siblings('.logisticsList').show();
            $(this).parents().parents().siblings().children('.logisticsList').hide();

            initLogistics(data)
        } else {
            $(this).removeClass('active').parents().siblings('.logisticsList').hide();
        }

    })
}

function initChat() {
    if (customer && customer.real == 1) {
        Service.loadChatRecord()
        $("#load_chat_more").bind("click", function () {
            Service.loadChatRecord()
        })
    } else {
        $('.load-chat-more').hide()
        $('.history-up').hide()
    }
}

function initLoadGoods() {
    var gc = Common.getUrlParams().gc
    if (gc) {
        Request.jsonp(Api.goodsDetail, {
            gc: gc,
            plat: 1
        }, false, function (res) {
            if (res.rc == 0) {
                var goodsDetail
                if (res.data) {
                    goodsDetail = JSON.parse(res.data)
                    console.log(res.data, 295)
                }
                if (goodsDetail && goodsDetail.items && goodsDetail.items.length > 0) {
                    createGoodsHtml(goodsDetail.items[0])
                    return
                }
            }
        })
    }
}

function initLoadRecommend() {
    Request.jsonp(Api.recommendList, {}, true, function (res) {
        if (res.rc == 0) {
            if (res.data) {
                var _html = createRecommendHtml(res.data)
                if (_html.length > 0) {
                    $("#mark_list").html(_html)
                    $("div.marks_info").show()
                }
            }
        }
    });
}

function createRecommendHtml(recommends) {
    var _html = [];
    if (recommends && recommends.length > 0) {
        var recommend;
        for (var i = 0; i < recommends.length; i++) {
            recommend = recommends[i];
            if (recommend) {
                _html.push("<a href='" + (recommend.recoUrl ? recommend.recoUrl : "javascript://;") + "' target='_blank'>" + (recommend.recoName ? recommend.recoName : "") + "</a>");
            }
        }
    }
    return _html.join("");
}


// 移动到最后
function setCaretPosition(ele) {
    ele.blur();
    ele.focus();
    var len = ele.value.length;
    if (document.selection) {
        var sel = ele.createTextRange();
        sel.moveStart('character', len);
        sel.collapse();
        sel.select();
    } else {
        ele.selectionStart = ele.selectionEnd = len;
    }
}

function createGoodsHtml(item) {
    var url, goodsUrl
    if (Common.isMobile()) {
        url = item.wapDetailUrl
    } else {
        url = item.pcDetailUrl
    }
    if (item.path && item.path.charAt(0) === '/') {
        goodsUrl = 'https://p1.lefile.cn' + item.path
    } else {
        goodsUrl = 'https://p1.lefile.cn/' + item.path
    }
    var html = '<div class="goods-info">' +
        '<div class="goods-container">' +
        '<div class="goods-img"><img id="goods_pic" src="' + goodsUrl + '" style="width: 40px;"></div>' +
        '<div class="goods-name"><span>' + item.name + '</span></div>' +
        '</div>' +
        '<div class="goods-line"></div>' +
        '<div class="goods-send-url" data-url="' + url + '"> <span>发送地址</span> </div>' +
        '</div>'
    ChatResolver.renderHtml(html)
    $('.goods-send-url').unbind().bind('click', function () {
        var goodsUrl = $('.goods-send-url').attr("data-url")
        if (goodsUrl) {
            io.sendMsg(goodsUrl, "TEXT")
        }
    })
}

function orderData(res, count) {
    var data = "";
    for (var i = 0; i < count; i++) {
        data += `<ul>
                    <li class="orderLi">
                        <div style="display: inline-block;">
                            <label>订单号:</label>
                            <span>${res[i].orderId} </span>
                            <span>${res[i].orderTime} </span>
                        </div>
                        <span>
                            <b>${res[i].orderStatusInfo} </b>
                        </span>
                    </li>`.replace(/\n/gm, "")
        for (var j = 0; j < res[i].prdInfoList.length; j++) {
            data += `<li class="prdLi">
                        <div style="display: flex; width: 100%;">
                            <div class="img">
                                <img src="${res[i].prdInfoList[j].prdImgUrl} " alt=""/>
                            </div>
                            <div class="myorder_content">
                                <a href="${res[i].prdInfoList[j].prdDetailUrl}" target="_blank" class="myorder_content_name">
                                    ${res[i].prdInfoList[j].prdName} 
                                </a>
                                <p style="color: #999;">
                                    <span>商品编号：</span>
                                    <span style="margin-left: -0.5rem;">${res[i].prdInfoList[j].prdCode} </span>
                                </p>   
                                <p style="color: #999;">
                                    <span>数量：</span>
                                    <span style="margin-left: -0.5rem;">${res[i].prdInfoList[j].prdAcount} </span>
                                    <b style="color: #000;">￥${res[i].prdInfoList[j].prdPrice} </b>
                                </p>
                                <button class="send-order" data-index="${j}">发送</button>
                            </div>
                        </div>
                    </li> `.replace(/\n/gm, "")
            if (res[i].prdInfoList[j].additional) {
                for (var l = 0; l < res[i].prdInfoList[j].additional.length; l++) {
                    data += `<li class="prdLi">
                                <div style="display: flex; width: 100%;">
                                    <img class="img" src="${res[i].prdInfoList[j].additional[l].prdImgUrl}" alt="">
                                    <div class="myorder_content">
                                        <p class="myorder_content_name">
                                            <b style="color:#e2231a;">${res[i].prdInfoList[j].additional[l].isGift ==="1" ? "【赠品】": res[i].prdInfoList[j].additional[l].isService === "0" ?  "": "【服务】"}</b>${res[i].prdInfoList[j].additional[l].prdName}
                                        </p>
                                        <p style="color: #959595;">
                                            <span>数量：</span>
                                            <span style="margin-left: -8px;">${res[i].prdInfoList[j].additional[l].prdAcount}</span>
                                        </p>
                                        <p style="display: ${res[i].prdInfoList[j].additional[l].isGift ==="1" ? "none" : "inline-block" };"><b>￥${res[i].prdInfoList[j].additional[l].prdPrice}</b></p>
                                    </div>
                                </div>
                            </li> `.replace(/\n/gm, "")
                }
            }
        };

        data += `<li class="prdlenLi">
                    <div style="display: inline-block;">
                        <span>共</span><span>${res[i].prdInfoList.length}</span><span style="padding-right: 12px;">件</span>
                        <span>订单金额：</span><span style="color: #f4364c; margin-left: -8px"><b>￥${res[i].orderAmount}</b></span>
                    </div>
                </li>
                <li style="justify-content: center;">
                    <button class="view" data-index="${i}">
                        <lable>查看物流</lable>
                        <img src="./images/chatwap/down-arrow.png">
                    </button>
                </li>
                <li style="display:none" class="logisticsList"></li>
            </ul>`.replace(/\n/gm, "")

    }
    data += `<ul class="loading"><p>疯狂加载中...</p></ul><ul class="loading_end"><p>亲，没有更多了~</p></ul>`
    $('.myorder_main').html(data)

}

// 加载订单列表
function initOrderList(num) {
    var urlParams = Common.getUrlParams(),
        ttc = urlParams.ttc ? urlParams.ttc : 1,
        params = {
            ttc: ttc,
            pageNum: pageNum,
            pageSize: 3
        };
    pageNum++,
    Request.jsonp(Api.orderList, params, true, function (res) {
        if (res.rc == 0) {
            if (res.data) {
                $('.myorder_nall').hide()
                arrOrder = arrOrder.concat(res.data);
                orderData(arrOrder, arrOrder.length);

                $('.myorder_main').on("scroll", scrollHandler); //绑定滚动事件
                num === 1 ? $('.loading').hide() : $('.loading').show()
            } else {
                $('.myorder_nall').show()
                $('.loading').hide()
                $('.loading_end').show()
                setTimeout(function(){
                    $('.loading_end').hide()
                },600)
                $('.myorder_main').off("scroll", scrollHandler); //卸载滚动事件
            }

        } else {
            $('.myorder_main').off("scroll", scrollHandler); //卸载滚动事件
        }
    })
}

function logisticsData(res, data) {
    let logData = `<div class="package-status"><div class="status-box">
        <ul class="status-list" id="status-list">
        <div style="display: list-item;"><div class="status-content-latest">${data.deliveryAddress.address}</div></div>`

    logData += res.data.logistics0.map((item, idx, arr) => {
        return `<li class="test ${idx === 0 && data.orderStatus === "9" ? "endact" : ""} ${idx === (arr.length - 1) ? "firstact" : ""}" style="display:block">
             <div class="status-content-before">${item.lgdesc}</div>
             <div class="status-time-before">${item.lgtime}</div>
        </li>`
    }).join("")

    logData += '</ul></div></div>'
    $('.logisticsList').html(logData)
}

function logisticsNull(res) {
    let logData = `<div class="package-status"><div class="status-box">
        <ul class="status-list" id="status-list">暂无物流信息</ul></div></div>`
    $('.logisticsList').html(logData)
}

// 加载物流
function initLogistics(data) {

    var urlParams = Common.getUrlParams()
    var ttc = urlParams.ttc ? urlParams.ttc : 1
    var params = {
        ttc: ttc,
        orderCode: data.orderId
    }
    Request.jsonp(Api.logistics, params, true, function (res) {
        if (res.rc == 0) {
            logisticsData(res, data)
        } else {
            logisticsNull(res)
        }
    })
}

// 上滑事件
function scrollHandler() {
    $('.loading').show()
    if (($(this)[0].scrollTop + $(this).height()) >= $(this)[0].scrollHeight) {
        clearTimeout(timers);
        timers = setTimeout(function () {
            initOrderList(1)
            off_on = true;
        }, 800);
    }
}