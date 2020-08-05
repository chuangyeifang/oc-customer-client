var face = {
    em: undefined,
    toEmoji: undefined,
    show: undefined,
    hide: undefined
}

var Emoji = {
    face: createEmoji()
}

function render_nav(obj, options) {
    $(obj).append('<div class="emoji-inner"><ul class="emoji-nav"></ul><div class="emoji-content"></div></div>');
    if (!options.showbar) {
        $(obj).addClass('no-bar');
        return
    };
    var navs = _.reduce(options.category, function(items, item) {
        var citem = _.find(options.data, function(da) {
            return da.typ == item;
        });
        return items + '<li data-name="' + item + '">' + citem.nm + '</li>'
    }, '');
    $(obj).find('.emoji-nav').empty().append(navs);
};
//渲染表情
function render_emoji(obj, options, typ) {
    var list = _.find(options.data, function(item) {
        return item.typ == typ
    });
    if (!list) {
        list = options.data[0]
    };
    var imgs = _.reduce(list.items, function(items, item) {
        if (item) {
            return items + '<img title="' + item.name + '" src="' + options.path + item.src + '" data-name="' + item.name + '" data-src="' + options.path + item.src + '">'
        } else {
            return items
        }
    }, '');
    $(obj).find('.emoji-content').empty().append(imgs);
    $(obj).find('.emoji-nav li[data-name=' + list.typ + ']').addClass('on').siblings().removeClass("on")
};
//切换元素
function switchitem(obj, options) {
    $(obj).on(options.trigger, '.emoji-nav > li', function() {
        render_emoji(obj, options, $(this).attr('data-name'));
        return false
    });
    $(obj).on('click', '.emoji-content > img', function() {
        options.insertAfter({
            name: $(this).attr('data-name'),
            src: $(this).attr('data-src')
        })
    })
};

function togglew(obj, option) {
    $(obj).on('click', '.emoji-tbtn', function() {
        $(obj).find('.emoji-inner').toggle();
        return false
    });
    $(document).click(function() {
        $(obj).hide();
        $(obj).find('.emoji-inner').hide();
    })
};
//jq插件
function initEmoji(opt) {
    var emojiContainer = $('#emoji_container');
    var options = $.extend({}, getData(), opt || {});
    face.hide = function() {
        emojiContainer.hide();
        emojiContainer.find('.emoji-inner').hide()
    };
    face.show = function() {
        emojiContainer.show();
        emojiContainer.find('.emoji-inner').show()
    };

    return emojiContainer.each(function() {
        if (!emojiContainer.find('.val').length > 0) {
            return false
        };

        //初始化tab
        render_nav(emojiContainer, options);
        //初始化表情
        render_emoji(emojiContainer, options);
        //切换表情
        switchitem(emojiContainer, options);
        //点击显示表情
        togglew(emojiContainer, options);
    })
};

// 插入、修改表情图片
function insertContent(myValue, t) {
    var messageArea = $('#message_area');
    var $t = messageArea[0];
    if (window.getSelection) {
        var startPos = $t.selectionStart;
        var endPos = $t.selectionEnd;
        var scrollTop = $t.scrollTop;
        $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
        messageArea.focus();
        $t.selectionStart = startPos + myValue.length;
        $t.selectionEnd = startPos + myValue.length;
        $t.scrollTop = scrollTop;
        if (arguments.length == 2) {
            $t.setSelectionRange(startPos - t, $t.selectionEnd + t);
            messageArea.focus()
        }
    } else if (document.selection) {
        messageArea.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        messageArea.focus();
        //moveStart
        sel.moveStart('character', -l);
        var wee = sel.text.length;
        if (arguments.length == 2) {
            var l = $t.value.length;
            sel.moveEnd("character", wee + t);
            t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
            sel.select();
        }
    } else {
        messageArea.value += myValue;
        messageArea.focus();
    }
    // 显示发送按钮
    $("#input-add-field").hide()
    $("#send_msg_btn").show()
}

function createEmoji() {
    var opts = {
        insertAfter: function(item) {
            // insertContent(document.getElementById('message_area'), item.src, '[:' + item.name + ':]')
            insertContent('[:' + item.name + ':]')
        },
        path: "images/"
    };
    initEmoji(opts);
    var arr = getEmoji();
    face.toEmoji = function(str) {
        var emojis = [];
        _.each(arr, function(ele) {
            if (ele !== null) {
                emojis.push(ele.name);
            }
        });
        var regex = new RegExp('\\[:(' + (emojis.length > 1 ? emojis.join("|") : (emojis + "")) + '):\\]', 'g');
        var emoji = function(key) {
            key = key.replace("[:", "").replace(":]", "");
            var list = _.filter(arr, function(ele) {
                if (ele == null) {
                    return false;
                }
                return ele.name == key;
            });
            return '<img name="[:' + key + ':]" src="' + opts.path + list[0].src + '" alt="' + key + '" style="width: 25px;height: 25px;cursor: pointer;vertical-align: middle;"/>';
        };
        return str.replace(regex, emoji);
    }
    return face;
}

function getEmoji(category) {
    var datas;
    if (category) {
        datas = this.data = _.filter(getData().data, function(ele) {
            return _.contains(category, ele.typ);
        });
    } else {
        datas = getData().data;
    }
    var i = 0,
        len = datas.length;
    var arr = [];
    for (; i < len; i++) {
        var item = datas[i].items,
            j = 0,
            len1 = item.length;
        for (; j < len1; j++) {
            arr.push(item[j]);
        }
    }
    return arr;
}

function getData() {
    return {
        data: [{
            "typ": "EmojiCategory-People",
            "nm": "人物",
            "items": [{
                "name": "笑脸",
                "src": "face/笑脸.png"
            }, {
                "name": "开心",
                "src": "face/开心.png"
            }, {
                "name": "大笑",
                "src": "face/大笑.png"
            }, {
                "name": "爱心",
                "src": "face/爱心.png"
            }, {
                "name": "飞吻",
                "src": "face/飞吻.png"
            }, {
                "name": "调皮",
                "src": "face/调皮.png"
            }, {
                "name": "讨厌",
                "src": "face/讨厌.png"
            }, {
                "name": "笑哭",
                "src": "face/笑哭.png"
            }, {
                "name": "流泪",
                "src": "face/流泪.png"
            },{
                "name": "坏笑",
                "src": "face/坏笑.png"
            }, {
                "name": "流汗",
                "src": "face/流汗.png"
            }, {
                "name": "汗颜",
                "src": "face/汗颜.png"
            },  {
                "name": "尴尬",
                "src": "face/尴尬.png"
            }, {
                "name": "流泪",
                "src": "face/流泪.png"
            }, {
                "name": "冷酷",
                "src": "face/冷酷.png"
            }, {
                "name": "惊恐",
                "src": "face/惊恐.png"
            }, {
                "name": "惊悚",
                "src": "face/惊悚.png"
            }, {
                "name": "惊讶",
                "src": "face/惊讶.png"
            }, {
                "name": "大惊",
                "src": "face/大惊.png"
            }, {
                "name": "大闹",
                "src": "face/大闹.png"
            }, {
                "name": "发呆",
                "src": "face/发呆.png"
            }, {
                "name": "犯困",
                "src": "face/犯困.png"
            }, {
                "name": "心碎",
                "src": "face/心碎.png"
            }, {
                "name": "酷",
                "src": "face/酷.png"
            }, {
                "name": "生气",
                "src": "face/生气.png"
            }, {
                "name": "闭嘴",
                "src": "face/闭嘴.png"
            }, {
                "name": "睡着",
                "src": "face/睡着.png"
            }, {
                "name": "奋斗",
                "src": "face/奋斗.png"
            }, {
                "name": "愤怒",
                "src": "face/愤怒.png"
            }, {
                "name": "瞌睡",
                "src": "face/瞌睡.png"
            }, {
                "name": "难过",
                "src": "face/难过.png"
            }, {
                "name": "天使",
                "src": "face/天使.png"
            }, {
                "name": "无聊",
                "src": "face/无聊.png"
            }, {
                "name": "骂人",
                "src": "face/骂人.png"
            }, {
                "name": "点赞",
                "src": "face/点赞.png"
            }, {
                "name": "懵逼",
                "src": "face/懵逼.png"
            }, {
                "name": "白眼",
                "src": "face/白眼.png"
            }, {
                "name": "恶魔",
                "src": "face/恶魔.png"
            }, {
                "name": "感冒",
                "src": "face/感冒.png"
            }, {
                "name": "爱你",
                "src": "face/爱你.png"
            }, {
                "name": "呕吐",
                "src": "face/呕吐.png"
            }, {
                "name": "呲牙",
                "src": "face/呲牙.png"
            }]
        }],
        path: 'images/',
        category: ['EmojiCategory-People'],
        showbar: true,
        trigger: 'click',
        insertAfter: function() {}
    }
}