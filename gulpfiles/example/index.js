var gulp = require('gulp')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var clean = require('gulp-clean')
var minimist = require('minimist')
var replace = require('gulp-replace')
var minifycss = require('gulp-minify-css')
var connect = require('gulp-connect')
var babel = require('gulp-babel')
var envOpts = {
    string: 'env',
    default: { env: 'prd' }  
}
var opts = minimist(process.argv, envOpts)

var env = opts.env
var openUrl = 'http://im.jshii.com.cn/example/' + env + '/pc/chat.html?ttc=1&skc=1'

var domain, ws, poll, api
if (opts.env == 'uat') {
    domain = "jshii.com.cn"
    ws = "ws://im.jshii.com.cn:6066"
    poll = "http://im.jshii.com.cn:6066"
    api = "http://im.jshii.com.cn:8080"
    loadCommon = "http://im.jshii.com.cn"
    homeUrl = "http://im.jshii.com.cn/chat.html"
} else {
    domain = "jshii.com.cn"
    ws = "ws://im.jshii.com.cn:6066"
    poll = "http://im.jshii.com.cn:6066"
    api = "http://im.jshii.com.cn"
    loadCommon = "http://im.jshii.com.cn"
    homeUrl = "http://im.jshii.com.cn/chat.html"
}

// 清空文件夹
gulp.task('clean', function() {
    return gulp.src('dist/example/' + env + '/', {read: false})
        .pipe(clean());
})

// 合并压缩 WAP端 JS
gulp.task('wap-js', function() {
    return gulp.src([
            'js/common/p-dialog.js', 
            'js/common/oc-div-edit.js', 
            'js/common/oc-config.js', 
            'js/common/oc-api.js', 
            'js/common/oc-common.js',
            'js/common/oc-notice.js',
            'js/common/oc-chat-resolver.js', 
            'js/common/oc-service.js',
            'js/common/oc-http-poll.js',
            'js/common/oc-websocket.js',
            'js/common/p-img-view.js',
            'js/common/oc-emoji.js',
            'js/example/wap/chat.js',
            'js/example/wap/main.js'
        ])
        .pipe(concat('wap.js'))
        .pipe(replace('$domain', domain))
        .pipe(replace('$ws', ws))
        .pipe(replace('$poll', poll))
        .pipe(replace('$api', api))
        .pipe(babel())
        .pipe(gulp.dest('dist/example/' + env + '/wap/js'))
        .pipe(rename({suffix: '.min'}))
        
        .pipe(uglify({
            mangle: { 
                toplevel: true 
            },
            compress: {
                drop_console: false,
                drop_debugger: true
            }
        }))
        .pipe(gulp.dest('dist/example/' + env + '/wap/js'));
})

// 合并压缩 PC端 JS
gulp.task('pc-js', function() {
    return gulp.src([
            'js/common/p-img-view.js', 
            'js/common/oc-div-edit.js',
            'js/common/oc-config.js',
            'js/common/oc-api.js',
            'js/common/oc-common.js',
            'js/common/oc-notice.js',
            'js/common/oc-chat-resolver.js',
            'js/common/oc-service.js',
            'js/common/oc-http-poll.js',
            'js/common/oc-websocket.js',
            'js/common/oc-emoji.js',
            'js/common/p-dialog.js',
            'js/example/pc/chat.js',
            'js/example/pc/main.js'
        ])
        .pipe(concat('pc.js'))
        .pipe(replace('$domain', domain))
        .pipe(replace('$ws', ws))
        .pipe(replace('$poll', poll))
        .pipe(replace('$api', api))
        .pipe(babel())
        .pipe(gulp.dest('dist/example/' + env + '/pc/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify({
            mangle: { 
                toplevel: true 
            },
            compress: {
                // drop_console: true,
                drop_console: false,
                drop_debugger: true
            }
        }))
        .pipe(gulp.dest('dist/example/' + env + '/pc/js'))
})

// 移动公共 PC JS
gulp.task('move-pc-extends-js', function() {
    return gulp.src([
            'js/extends/*.js'
        ])
        .pipe(gulp.dest('dist/example/' + env + '/pc/js'))
})

// 移动公共 WAP JS
gulp.task('move-wap-extends-js', function() {
    return gulp.src([
            'js/extends/*.js'
        ])
        .pipe(gulp.dest('dist/example/' + env + '/wap/js'))
})

// 移动 PC IMAGES
gulp.task('move-pc-images', function() {
    return gulp.src([
            'images/**',
        ])
        .pipe(gulp.dest('dist/example/' + env + '/pc/images'))
})

// 移动 WAP IMAGES
gulp.task('move-wap-images', function() {
    return gulp.src([
            'images/**',
        ])
        .pipe(gulp.dest('dist/example/' + env + '/wap/images'))
})

// 压缩PC CSS
gulp.task('pc-css', function() {
    return gulp.src([
            'css/example/pc/chat.css',
            'css/example/pc/emoji.css',
            'css/example/pc/p-dialog.css',
            'css/common/p-view.css'
        ])
        .pipe(concat('chat.css'))
        .pipe(gulp.dest('dist/example/' + env + '/pc/css'))
        .pipe(rename({suffix:'.min'}))  
        .pipe(minifycss())
        .pipe(gulp.dest('dist/example/' + env + '/pc/css'))
})

// 压缩WAP CSS
gulp.task('wap-css', function() {
    return gulp.src([
            'css/example/wap/chat.css',
            'css/example/wap/emoji.css',
            'css/example/wap/p-dialog.css',
            'css/common/p-view.css'
        ])
        .pipe(concat('chat.css'))
        .pipe(gulp.dest('dist/example/' + env + '/wap/css'))
        .pipe(rename({suffix:'.min'}))         
        .pipe(minifycss())
        .pipe(gulp.dest('dist/example/' + env + '/wap/css'))
})


// 移动 PC HTML
gulp.task('move-pc-html', function() {
    return gulp.src([
            'html/example/pc/chat.html'
        ])
        .pipe(replace('${loadCommon}', loadCommon))
        .pipe(replace('${url}', homeUrl))
        .pipe(gulp.dest('dist/example/' + env + '/pc'))
})

// 移动 WAP HTML
gulp.task('move-wap-html', function() {
    return gulp.src([
            'html/example/wap/chat.html'
        ])
        .pipe(replace('${url}', homeUrl))
        .pipe(gulp.dest('dist/example/' + env + '/wap'))
})

// 本地调试环境local
gulp.task('server', function (callback) {
    connect.server({
        root: 'dist',
        host: 'oc.lenovouat.com',
        port: 80,
        livereload:true
    });
    if (opts.env !== 'prd') {
      require('opn')(openUrl)
    }
    callback()
})

// 自动更新
gulp.task('watchs', function() {
    gulp.watch('js/**', gulp.series(
        'wap-js', 
        'pc-js', 
        'move-pc-extends-js', 
        'move-wap-extends-js',
        'reload'
    ))
    gulp.watch('css/**', gulp.series(
        'pc-css',
        'wap-css',
        'reload'
    ))
    gulp.watch('images/**', gulp.series(
        'move-pc-images',
        'move-wap-images',
        'reload'
    ))
    gulp.watch('html/**', gulp.series(
        'move-pc-html',
        'move-wap-html',
        'reload'
    ))
})

gulp.task('reload', function() {
    return gulp.src('dist').pipe(connect.reload())
})

// 初始化页面
gulp.task('init', gulp.series(
    'clean',
    'wap-js', 
    'pc-js', 
    'move-pc-extends-js', 
    'move-wap-extends-js', 
    'move-pc-images',
    'move-wap-images', 
    'pc-css',
    'wap-css',
    'move-pc-html',
    'move-wap-html'
))

// 串行执行任务
gulp.task('default', 
    gulp.series(
        'init',
        'server',
        'watchs'
    )
)