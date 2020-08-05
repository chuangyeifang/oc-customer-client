(function(root, factory){
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
          (root.iNotify = factory());
          
}(window, function() {
  var oldTitle = document.title;
  var iNotify = function(opts){
      this.init(opts||{});
  };
  iNotify.prototype.init = function(opts){
      this.open = false
      this.effect = opts.effect || "flash";
      this.message = opts.message || "有新消息了!";
      this.title = document.title || this.message;
      this.interval = opts.interval || 500;
      this.onceTime = opts.onceTime ||2000;
      this.isActiveW = false;//当前窗口是不是激活状态
      //开始检测状态
      this.onMonitor();
  };
  iNotify.prototype.start = function(){
      var _this= this;
      _this.stop();
      //falsh 消息闪动title
      if(_this.effect==="flash"){
          var isOld = false;
          return  _this.flashInterval = setInterval(function(){
              isOld?(document.title=oldTitle):(document.title=_this.message);
              isOld=!isOld;
          },_this.interval);
      }
      //scroll 消息滚动title
      if(_this.effect==="scroll"){
          document.title=_this.message;
          return  _this.scrollInterval = setInterval(function(){
              var text = document.title;
              document.title=text.substring(1,text.length)+text.substring(0,1)
              text=document.title.substring(0,text.length);
          }, _this.interval);
      }
  };
  iNotify.prototype.stop = function(){
      var _this = this;
      _this.isActiveW = false;
      clearTimeout(_this.onceTimeout);
      if(_this.effect ==="flash"){
          _this.flashInterval && clearInterval(_this.flashInterval);
          return document.title = oldTitle;
      }
      if(_this.effect === "scroll"){
          _this.scrollInterval && clearInterval(_this.scrollInterval);
          return document.title = oldTitle;
      }
  };
  iNotify.prototype.once = function(){
      var _this = this;
      _this.stop();
      if(_this.effect==="flash" || _this.effect === "scroll"){
          clearTimeout(_this.onceTimeout);
          _this.start();
          return _this.onceTimeout = setTimeout(function(){
              _this.stop();
          },_this.onceTime);
      }
  };
  iNotify.prototype.onMonitor = function(){
    var _this = this;
    window.onfocus = function() {
      if(!_this.isActiveW){
        _this.isActiveW = true;
        _this.stop();
      }
    }
    document.onclick = function() {
      if(!_this.isActiveW){
        _this.isActiveW = true;
        _this.stop();
      }
    }
  };

  return iNotify;
}));