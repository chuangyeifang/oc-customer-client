var base = Config.api
var Api = {
    auth: base + "/customer/auth",
    opinion: base + "/opinion/rate",
    chatRecord: base + "/chat/before",
    hot: base + "/hot/question",
    uploadImage: base + "/upload/image",
    uploadImgb64: base + "/upload/imgb64",
    goodsDetail: base + "/goods/info",
    recommendList: base + "/recommend/list",
    orderList: base + "/order/list",
    logistics: base + "/order/logistics"
}

var Request = {
    get: function(url, params, async, success, error) {
        params.t = new Date().getTime()
        $.ajax({
            type: "GET",
            url: url,
            data: params,
            dataType: 'json',
            async: async,
            xhrFields: { withCredentials: true },
            success: function(res) {
                success && success instanceof Function && success(res)
            },
            error: function(res) {
                error && error instanceof Function && error(res)
            }
        })
    },
    post: function(url, params, async, success, error) {
        params.t = new Date().getTime()
        $.ajax({
            type: "POST",
            url: url,
            data: params,
            dataType: 'json',
            async: async,
            xhrFields: { withCredentials: true },
            success: function(res) {
                success && success instanceof Function && success(res)
            },
            error: function(res) {
                error && error instanceof Function && error(res)
            }
        })
    },
    jsonp: function(url, params, async, success, error) {
        params.t = new Date().getTime()
        $.ajax({
            type: "POST",
            url: url,
            data: params,
            dataType: 'jsonp',
            async: async,
            jsonp: "callback",
            xhrFields: { withCredentials: true },
            success: function(res) {
                success && success instanceof Function && success(res)
            },
            error: function(res) {
                error && error instanceof Function && error(res)
            }
        })
    },
    uploadImg: function(url, formdata, async, success, error) {
        $.ajax({
            url: url,
            data: formdata,
            dataType: 'json',
            type: "POST",
            async: async,
            processData: false,
            contentType: false,
            xhrFields: { withCredentials: true }, // 添加cookie标识
            success: function(res) {
                success && success instanceof Function && success()
            },
            error: function(res) {
                error && error instanceof Function && error()
            }
        })
    }
}