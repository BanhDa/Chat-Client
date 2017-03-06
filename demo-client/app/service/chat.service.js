"use strict";
/**
 * Created by tuantran on 3/4/2017.
 */
var Observable_1 = require('rxjs/Observable');
var ChatService = (function () {
    function ChatService() {
        this.url = 'http://localhost:8088';
    }
    ChatService.prototype.sendMessage = function (message) {
        this.socket.emit('add-message', message);
    };
    ChatService.prototype.getMessages = function () {
        var _this = this;
        var observable = new Observable_1.Observable(function (observer) {
            // this.socket = io(this.url);
            _this.socket.on('message', function (data) {
                observer.next(data);
            });
            return function () {
                _this.socket.disconnect();
            };
        });
        return observable;
    };
    return ChatService;
}());
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map