var Chat = {
    startChat: function () {
        initComponent()
        initEvent()
    }
}

var imgb64;

var orderCode,
    arrOrder = [],
    pageNum = 1;

function initComponent() {
    initTab()
    initLoadHots()
    initToolsBar()
}

function initEvent() {
    window.onbeforeunload = function (e) {
        io.close()
    }

    $(document).click(function (e) {
        var _target = $(e.target);
        //关闭表情框
        if (_target.closest("#emoji_container").length == 0) {
            $('#emoji_container').hide();
            Emoji.face.hide();
        }
    })

    // 图片粘贴
    $("#message_area").unbind("paste").bind("paste", function (e) {
        pasteEvent(e)
    })

    $("#set-file").unbind("click").bind('click', function () {
        Common.uploadImg(Api.uploadImage, function (res) {
            if (res.rc == 0) {
                var img = Common.createImgHtml(res.imgurl, true)
                io.sendImg(img, res.imgurl, "IMAGE")
            } else {
                Pdialog.showDialog({
                    content: res.rm
                })
            }
        })
        return false
    })
    $('#send-imgb64').bind('click', function () {
        if (!imgb64) {
            $('.ay-mask').hide()
            Pdialog.showDialog({
                content: "未获取到图片信息，请重新操作"
            })
            return false
        }
        Common.uploadImgB64(Api.uploadImgb64, imgb64, function (res) {
            if (res.rc == 0) {
                $('.ay-mask').hide()
                var img = Common.createImgHtml(res.imgurl, true)
                io.sendImg(img, res.imgurl, "IMAGE")
            } else {
                Pdialog.showDialog({
                    content: res.rm
                })
            }
        })
        return true
    })

    $('#send-imgb64-cancel').bind('click', function () {
        $('.ay-mask').hide()
        return true
    })

    //满意度评价---pc
    $("#set-evaluate").unbind('click').bind('click', function () {
        if (!customer.cid) {
            Pdialog.showDialog({
                content: "咨询后在评价的哦!"
            })
            return false
        }

        if ($("#opinion_submit").data("isOpinion")) {
            Pdialog.showDialog({
                content: "您已经评论过了!"
            })
            return false
        }
        var $opin = $("#option_box");
        if ($opin.is(":visible")) {
            $opin.hide()
            return false
        }
        $opin.show()
        return false
    });

    $("#option_box").delegate(".close-tool,.cancel", "click", function () {
        $("#option_box").hide()
        return false
    }).delegate("input[name=evaluation]:radio", "change", function () {
        var opinion_value = $('input[name=evaluation]:radio:checked').val() || '5' // 获取评价
        if ((opinion_value == "1" || opinion_value == "2" || opinion_value == "3")) {
            $("#suggest_box").css("visibility", "visible")
        } else {
            $("#suggest_box").css("visibility", "hidden")
        }
    }).delegate("#opinion_submit", "click", function () {
        if ($("#opinion_submit").data("isOpinion")) {
            Pdialog.showDialog({
                content: "您已经评论过了!"
            })
            return false
        }

        var opin_type = $('input[name=evaluation]:radio:checked').val() || '' // 获取评价
        var opin_content = $("#opinion_desp").val() //获取建议

        if ((opin_type == "1" || opin_type == "2") && $.trim(opin_content).length < 10) {
            Pdialog.showDialog({
                content: "请填写您的建议且建议内容至少10个字!"
            })
            $("#opinion_desp").focus()
            return false
        }

        if ($.trim(opin_content)) {
            opin_content = EscapeSequence.filterHtmlJsSpaceEnter(opin_content)
        }

        var params = {
            chatId: customer.cid,
            opinion: opin_type,
            suggest: opin_content
        };
        if (params.chatId && params.opinion && (params.opinion != '1' || params.opinion != '2')) {
            appraiseElement(Api.opinion, params)
        } else if (params.chatId && params.opinion && (params.opinion == '1' || params.opinion == '2') && params.suggest) {
            appraiseElement(Api.opinion, params)
        } else {
            Pdialog.showDialog({
                content: "请完善评论信息!"
            })
        }
    });
}

function appraiseElement(opinion, params) {
    Request.jsonp(opinion, params, true, function (res) {
        if (res.rc == 0) {
            $("#opinion_desp").val("");
            $("div.choise-eva input").removeAttr("checked");
            $("#opinion_submit").data("isOpinion", true)
            Pdialog.showDialog({
                content: res.rm
            })
            $("#option_box").hide();
            return false;
        } else {
            Pdialog.showDialog({
                content: res.rm
            })
        }
    })
}

function initToolsBar() {
    $("#opinion_desp").val("");

    $('#set-face').click(function () {
        $('#emoji_container').show()
        Emoji.face.show()
        return false
    })
}

//剪切板粘贴图片
function pasteEvent(e) {
    var event = e.originalEvent;
    // 添加到事件对象中的访问系统剪贴板的接口
    var clipboardData = event.clipboardData,
        i = 0,
        items, item, types;
    if (clipboardData) {
        items = clipboardData.items;
        if (!items) {
            return;
        }
        item = items[0];
        // 保存在剪贴板中的数据类型
        types = clipboardData.types || [];
        for (; i < types.length; i++) {
            if (types[i] === 'Files') {
                item = items[i];
                break;
            }
        }
        // 判断是否为图片数据
        if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
            // 读取该图片
            imgReader(item);
        }
    }
}

function imgReader(item) {
    var file = item.getAsFile();
    var reader = new FileReader();
    reader.onload = function (e) {
        imgb64 = e.target.result;
        $("#showPic").html("");
        $("#showPic").append('<p><img id="pasteImg" src="' + e.target.result + '" class="sendImg"></p>')
        $('#pasteImg').attr("style", "max-width: 480px; max-height:200px");
        $('.ay-mask').show();
    };
    reader.readAsDataURL(file);
};

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

//Tab添加切换事件
function initTab() {
    $("#hot_tab").unbind("click").bind("click", function () {
        $("#hot_tab").siblings().removeClass("active").end().addClass("active");
        $("#hot_list").siblings().hide().end().show();
    });
}

// 加载热点问题
function initLoadHots() {
    var params = {}
    Request.jsonp(Api.hot, params, true, function (res) {
        if (res.rc == 0) {
            var tempDom = [];
            $("#hot_ul").val("");
            $.each(res.data, function (i, question) {
                tempDom.push('<li><h6><a href="javascript:;">' + (i + 1) + ". " + question.question + '</a></h6><div class="answer" style="display: none;"><i class="icons"></i><p style="font-size:12px;">' + question.answer + '</p></div></li>');
            });
            initHotsEvent()
            $("#hot_ul").append(tempDom.join(""));
        } else {
            Pdialog.showDialog({
                content: res.rm
            })
        }
    })
}

function initHotsEvent() {
  //初始化常见问题事件
  $("#hot_ul li h6").click(function () {
      var $self = $(this);
      var $content = $self.next();
      var $title = $self.find("a");
      var $parent = $self.parent();
      if ($content.is(":visible")) {
          $title.removeClass("active");
          $content.slideUp();
      } else {
          $title.addClass("active");
          $content.slideDown();
          $parent.siblings().find(".answer").slideUp();
          $parent.siblings().find("h6 a").removeClass("active");
      }
      return false;
  })
}

initHotsEvent()
