var Constant = {
  build_success: "会话创建成功！",
  waitting_tip: "当前客服繁忙，已加入等候队列（您前面还有 {0} 个人）请您耐心等候...",
  service_info: "客服工号 {0} 为您提供服务~",
  close_tip: "会话已结束（回复再次咨询）."
}
var subId = 1000

var Common = {
    getCookie: function(name) {
        var arr
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2])
        } else {
            return "oc-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
    },
    getPid: function() {
        return (
            subId++ + "-" +
            fragment() + '-' +
            fragment() + '-' +
            fragment() + '-' +
            fragment() + '-' +
            fragment() + fragment() + fragment()
        )
    },
    dateFormat: function(obj) {
        var date
        if (obj && obj instanceof Date) {
            date = obj
        } else {
            date = new Date()
        }
        var y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate()
        return y + "-" +
            (m < 10 ? "0" + m : m) +
            "-" +
            (d < 10 ? "0" + d : d) +
            " " +
            date.toTimeString().substr(0, 8)
    },
    getUrlParams: function() {
        var urlSearch = decodeURI(location.search)
        if (urlSearch.indexOf("?") == 1) {
            return null
        }
        urlSearch = urlSearch.substr(1)
        var urls = urlSearch.split("&")
        var params = {}
        var temp
        for (var i = 0; i < urls.length; i++) {
            temp = urls[i].split("=")
            params[temp[0]] = temp[1]
        }
        return params
    },
    isMobile: function() {
        var agent = navigator.userAgent
        return !!agent.match(/AppleWebKit.*Mobile.*/) ||
            !!agent.match(/AppleWebKit/) && agent.indexOf('QIHU') &&
            agent.indexOf('QIHU') > -1 && agent.indexOf('Chrome') < 0
    },
    uploadImg: function(url, callback) {
        var fileForm = '<form id="submit_upload_img" method="post" action="' +
            url + '" enctype="multipart/form-data" target="iframe_upload_img" style="display: none">' +
            '<input type="file" id="input_upload_img" name="file" accept=".jpg,.gif,.jpeg,.png" /></form>'
        var iframe = '<iframe id="iframe_upload_img" name="iframe_upload_img" style="display: none"></iframe>'
        $('#iframe_upload_img').remove()
        $('#submit_upload_img').remove()
        $('body').append(iframe)
        $('body').append(fileForm)

        $('#input_upload_img').change(function() {
            $("#submit_upload_img").submit()
        })

        $("#iframe_upload_img").load(function(e) {
            var res = $("#iframe_upload_img")[0].contentWindow.document.querySelector('body').innerHTML
            res = JSON.parse(res)
            callback && callback instanceof Function && callback(res)

        })

        $("#input_upload_img").click();
    },
    uploadImgB64: function(url, imgB64, callback) {
        var fileForm = '<form id="submit_upload_img" method="post" action="' +
            url + '" enctype="multipart/form-data" target="iframe_upload_img" style="display: none">' +
            '<input id="input_upload_img" name="imgb64" value="' +
            imgB64 + '" accept=".jpg,.gif,.jpeg,.png" /></form>'
        var iframe = '<iframe id="iframe_upload_img" name="iframe_upload_img" style="display: none"></iframe>'
        $('#iframe_upload_img').remove()
        $('#submit_upload_img').remove()
        $('body').append(iframe)
        $('body').append(fileForm)

        $("#iframe_upload_img").load(function(e) {
            var res = $("#iframe_upload_img")[0].contentWindow.document.querySelector('body').innerHTML
            res = JSON.parse(res)
            callback && callback instanceof Function && callback(res)
        })

        $("#submit_upload_img").submit()
    },
    createImgHtml: function(imgurl) {
        return '<img src="' + imgurl + '" style="max-width: 100%; max-height: 300px;" onload="conFitScroll()" />'
    },
    stopPropagation: function(event) {
        if (window.showModalDialog) {
            window.event.cancelBubble = true
        } else {
            event.stopPropagation()
        }
    }
}

function fragment() {
    return Math.floor(65535 * (1 + Math.random())).toString(16).substring(1)
}