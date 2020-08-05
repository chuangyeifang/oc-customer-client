var Pview = initPView()

var pImgPro = {}

function initPView() {
    $(".p-view").on("click", "img", function(e) {
        showPzqImgView(this)
    })
}

function showPzqImgView(imgPro) {
    var winWidth = $(window).width()
    var winHeight = $(window).height()
    var imgWidth = imgPro.naturalWidth
    var imgHeight = imgPro.naturalHeight

    if (winWidth < imgWidth) {
        imgWidth = winWidth
        imgHeight = imgHeight - parseInt((imgWidth - winWidth) * (imgWidth / imgHeight))
    }

    if (winHeight < imgHeight) {
        imgHeight = winHeight
        imgWidth = imgWidth - parseInt((imgHeight - winHeight) * (imgHeight / imgWidth))
    }

    pImgPro.src = imgPro.src
    pImgPro.rotate = 0
    pImgPro.change = false

    pImgPro.scale = 100
    pImgPro.height = imgHeight
    pImgPro.width = imgWidth

    pImgPro.top = parseInt(winHeight / 2 - pImgPro.height / 2)
    pImgPro.left = parseInt(winWidth / 2 - pImgPro.width / 2)

    var pImgViewMaskWrapper = '<div id="p_img_mask_wrapper"><div id="p-view-close-container"><div id="p-view-close"></div></div>'
    var pImgContainer = '<div id="p_img_container" style="left:' + pImgPro.left + 'px; top: ' + pImgPro.top + 'px;">'
    var pImgEl = '<img id="p_img" src="' + pImgPro.src + '" style="width: ' + pImgPro.width + 'px;" />'
    var pScaleTip = '<div id="p_img_tip"></div>'
    var pImgOpts = '<div id="p_img_opts">' +
        '<span id="p_img_plus_btn" title="放大"></span>' +
        '<span id="p_img_minus_btn" title="缩小"></span>' +
        '<span id="p_img_rotate_btn" title="旋转"></span>' +
        '<span id="p_img_reset_btn" title="重置"></span>' +
        '</div>'
    var endTag = "</div>"
    $('#p_img_mask_wrapper').remove()

    var appendHtml = pImgViewMaskWrapper +
        pImgContainer +
        pImgEl +
        endTag +
        pScaleTip +
        pImgOpts +
        endTag
    $('body').append(appendHtml)

    initPViewEvent()
}

function initPViewEvent() {
    $('#p_img_mask_wrapper').unbind("click").bind("click", function() {
        Common.stopPropagation(event)
        $('#p_img_mask_wrapper').remove()
        pImgPro = {}
    })

    $('#p_img_container').unbind("click").bind("click", function() {
        Common.stopPropagation(event)
    })

    $('#p_img_plus_btn').unbind("click").bind("click", function() {
        Common.stopPropagation(event)
        pImgPro.scale += 10
        if (pImgPro.scale >= 260) {
            pImgPro.scale = 260
            $('#p_img_tip').html('已经是最大比例' + pImgPro.scale + '%').finish().fadeIn().delay(1500).fadeOut()
        } else {
            var scale = pImgPro.scale / 100
            $('#p_img_tip').html(pImgPro.scale + '%').finish().fadeIn().delay(1500).fadeOut()
            $('#p_img').width(pImgPro.width * scale)
        }
        if (!pImgPro.change) {
            pImgToCenter()
        }
    })

    $('#p_img_minus_btn').unbind("click").bind("click", function() {
        Common.stopPropagation(event)
        pImgPro.scale -= 10
        if (pImgPro.scale <= 0) {
            pImgPro.scale = 10
            $('#p_img_tip').html('已是最小比例' + pImgPro.scale + "%").finish().fadeIn().delay(1500).fadeOut()
        } else {
            var scale = pImgPro.scale / 100
            $('#p_img_tip').html(pImgPro.scale + '%').finish().fadeIn().delay(1500).fadeOut()
            $('#p_img').width(pImgPro.width * scale)
        }
        if (!pImgPro.change) {
            pImgToCenter()
        }
    })

    $('#p_img_rotate_btn').unbind("click").bind("click", function() {
        Common.stopPropagation(event)
        pImgPro.rotate = pImgPro.rotate + 90
        if (pImgPro.rotate > 360) {
            pImgPro.rotate = 90
        }
        $('#p_img_tip').html('旋转' + pImgPro.rotate + "度").finish().fadeIn().delay(1500).fadeOut()
        $('#p_img').css('transform', 'rotate(' + pImgPro.rotate + 'deg)')
    })

    $('#p_img_reset_btn').unbind("click").bind("click", function(event) {
        Common.stopPropagation(event)
        $('#p_img_tip').html('重置').finish().fadeIn().delay(1500).fadeOut()
        $('#p_img').width(pImgPro.width)
        $('#p_img').css('transform', 'rotate(0deg)')
        pImgToCenter()
        pImgPro.scale = 100
        pImgPro.change = false
    })
    var $pImg = $('#p_img_container')

    $pImg.bind("mousedown", function(downEvent) {
        Common.stopPropagation(downEvent)
        if (downEvent.button == 0) {
            $('#p_img_opts').hide()
            var imgOffset = $pImg.offset()
            var offsetX = downEvent.pageX - imgOffset.left
            var offsetY = downEvent.pageY - imgOffset.top
            $pImg.unbind('mousemove').bind('mousemove', function(moveEvent) {
                pImgPro.change = true
                $pImg.css('left', (moveEvent.pageX - offsetX) + 'px')
                $pImg.css('top', (moveEvent.pageY - offsetY) + 'px')
                return false
            })
            $pImg.unbind('mouseup').bind('mouseup', function() {
                $pImg.unbind('mousemove')
                $('#p_img_opts').show()
                return
            })
        }
        return false
    })
}

function pImgToCenter() {
    var winWidth = $(window).width()
    var winHeight = $(window).height()
    var imgW = $('#p_img').width()
    var imgH = $('#p_img').height()

    $('#p_img_container').css({ "left": (winWidth / 2 - imgW / 2) + "px", "top": (winHeight / 2 - imgH / 2) })
}