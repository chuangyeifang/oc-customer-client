/*
 * 替换html标签
 * */
var EscapeSequence = {
    // 正则去掉非法标签<html> <javascript> 多余换行及空格, 除<br>
    filterHtmlJsSpaceEnter: function(str) {
        if (str && str.length > 0) {
            str = str.replace(/[\s| | ]*\r/gi,' ')
            str = str.replace(/<(?!br([/]*)>)[^>]*>/gi, "")
        }
        return str
    },
    // 用正则表达式实现html转码
    htmlEncodeByRegExp: function(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, " ");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
    },
    // 用正则表达式实现html解码
    htmlDecodeByRegExp: function(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        return s;
    },
    //html转字符
    htmlTurnCharacter: function(str) {
        var s = "";
        if (str.length == 0) return "";
        var regex = /(.*?)<img.*?alt="(.*?)">/ig;
        s = str.replace(regex, "$1$2");
        return s;
    }
}

function edittable() {
    $('[contenteditable]').each(function() {
        try {
            document.execCommand("AutoUrlDetect", false, false);
        } catch (e) {}

        $(this).on('paste', function(e) {
            e.preventDefault();
            var text = null;

            if (window.clipboardData && clipboardData.setData) {
                text = window.clipboardData.getData('text');
            } else {
                text = (e.originalEvent || e).clipboardData.getData('text/plain');
            }
            if (!text) {
                return false;
            }
            if (document.body.createTextRange) {
                console.log('insert Text');
                if (document.selection) {
                    textRange = document.selection.createRange();
                } else if (window.getSelection) {
                    sel = window.getSelection();
                    var range = sel.getRangeAt(0);
                    var tempEl = document.createElement("span");
                    tempEl.innerHTML = "&#FEFF;";
                    range.deleteContents();
                    range.insertNode(tempEl);
                    textRange = document.body.createTextRange();
                    textRange.moveToElementText(tempEl);
                    tempEl.parentNode.removeChild(tempEl);
                }
                textRange.text = text;
                textRange.collapse(false);
                textRange.select();
            } else {
                // Chrome之类浏览器
                document.execCommand("insertText", false, text);
            }
        });
        // 去除Crtl+b/Ctrl+i/Ctrl+u等快捷键
        $(this).on('keydown', function(e) {
            // e.metaKey for mac
            if (e.ctrlKey || e.metaKey) {
                switch (e.keyCode) {
                    case 66: //ctrl+B or ctrl+b
                    case 98:
                    case 73: //ctrl+I or ctrl+i
                    case 105:
                    case 85: //ctrl+U or ctrl+u
                    case 117:
                        e.preventDefault();
                        break;
                }
            }
        });
    });
}