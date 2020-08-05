var chatRecordMark = {
  first: true
}
var Service = {
    loadChatRecord: function() {
        var params = {}
        if (chatRecordMark.id) {
            params.id = chatRecordMark.id
        }
        if (chatRecordMark.more) {
            return
        }
        Request.jsonp(Api.chatRecord, params, true, function(res) {
            if (res.rc == 0) {
                var records = res.data
                var len = records.length
                for (var i = 0; i < len; i++) {
                    ChatResolver.renderHistory(records[i])
                }
                if (chatRecordMark.first) {
                  chatRecordMark.first = false
                  $('#load_chat_more').show()
                  $('#history_up').show()
                }
                if (!chatRecordMark.id) {
                    ChatResolver.toScroll()
                }
                if (len > 0) {
                    chatRecordMark.id = records[len - 1].id
                }
                if (len < 10) {
                    chatRecordMark.more = true
                    $('.load-chat-more').html("没有更多")
                }
            }
        })
    }
}