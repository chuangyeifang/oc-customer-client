var Pdialog = {
    showDialog: function(options) {

        function doShowDialog() {
            options = $.extend({ title: "提示", content: "提示框" }, options)

            var pDialogMaskWrapper = '<div id="p_dialog_mask_wrapper">'

            var pImgContainer = '<div id="p_dialog_container">'

            var pDialogHeader = '<div id="p_dialog_header"><div id="p_dialog_header_name">' + options.title + '</div><div id="p_dialog_close"></div></div>'

            var pDialogContent = '<div id="p_dialog_content">' + options.content + '</div>'
            var pImgOpts = '<div id="p_dialog_opts">' +
                '<span id="p_dialog_submit">关闭</span>' +
                '</div>'
            var endTag = "</div>"
            $('#p_dialog_mask_wrapper').remove()

            var appendHtml =
                pDialogMaskWrapper +
                pImgContainer +
                pDialogHeader +
                pDialogContent +
                pImgOpts +
                endTag
            $('body').append(appendHtml)
            initEvent()
        }

        function initEvent() {
            $('#p_dialog_mask_wrapper').on('click', function() {
                $('#p_dialog_mask_wrapper').remove()
            })

            $('#p_dialog_close').on('click', function() {
                $('#p_dialog_mask_wrapper').remove()
            })

            $('#p_dialog_container').on('click', function(event) {
                Common.stopPropagation(event)
            })

            $('#p_dialog_submit').on('click', function() {
                $('#p_dialog_mask_wrapper').remove()
            })
        }

        doShowDialog()
    }
}