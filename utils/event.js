/*
*此文件用于跨页面通信
* 支持多种 Event 的通知
  支持对某一 Event 可以添加多个监听者
  支持对某一 Event 可以移除某一监听者
  将 Event 的存储和管理放在一个单独模块中，可以被所有文件全局引用
* */

let events = {};

let event = {
    my:null,
    setThis(self){
        this.my=self;

    },
    on(name, callback) {
        var callbacks = events[name];
        addToCallbacks(callbacks, callback);
    },
    remove(name, callback) {
        var callbacks = events[name];
        removeFromCallbacks(callbacks, callback);
    },
    emit(name, data) {
        var callbacks = events[name];
        emitToEveryCallback(callbacks, data);
    }

};
export default event;
