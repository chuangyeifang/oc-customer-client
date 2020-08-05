## gulp 安装插件说明
```
 安装gulp，执行命令npm install gulp --g
 安装js压缩插件gulp-uglify，命令npm install gulp-uglify --save-dev
 安装文件合并插件gulp-concat，命令npm install gulp-concat --save-dev
 安装清除文件插件gulp-clean，命令npm install gulp-clean --save-dev
 安装文件重命名插件gulp-rename，命令npm install gulp-rename --save-dev
 npm install minimist --save-dev
 安装CSS压缩插件npm install gulp-minify-css --save-dev 
 安装本地服务npm isntall opn --save-dev
 npm isntall gulp-connect --save-dev
```
## 访客端使用说明

## npm 配置淘宝镜像
## npm install package --registry=https://registry.npm.taobao.org
## npm install -g cnpm --registry=https://registry.npm.taobao.org

## 启动运行
```
prd 生产执行 （用于生产环境打包使用）
gulp --env prd --tenant example

uat 测试执行 （用于前端开发使用）
gulp --env uat --tenant example

dev 本地执行（用于服务端开发使用）
gulp --env dev --tenant example

说明: 
  gulp 需要全局安装
  env: 环境（dev/uat） 默认值可以在gulpfile.js进行配置
  tenant: 租户 默认值 example
```

## 安装
```
npm install
```
