/**
 * Created by Kazak_VV on 21.08.2014.
 */
define(['jquery'], function($) {

    return function(socketUrl) {

        /** **/
        this.onSocketOpenedHandler;

        /** **/
        this.onSocketMessageHandler;

        /** **/
        this.onSocketClosedHandler;

        /** **/
        this.onSocketNotSupportedHandler;

        /** **/
        var context = this;

        /** **/
        var socket;

        if ('WebSocket' in window) {

            socket = new WebSocket(socketUrl);

            socket.onopen = function(){
                console.log('Socket has been opened...');
                if (context.onSocketOpenedHandler) {
                    context.onSocketOpenedHandler();
                }
            }

            socket.onclose = function(closeEvent){
                console.log('Socket has been closed...');
                if (context.onSocketClosedHandler) {
                    context.onSocketClosedHandler();
                }
            }

            socket.onmessage = function (event){
                 console.log('Proceed socket message.');
                 if (context.onSocketMessageHandler) {
                     context.onSocketMessageHandler(event);
                 }
            }

        } else {

            console.error('Socket not supported error');
            if (context.onSocketNotSupportedHandler) {
                context.onSocketNotSupportedHandler();
            }
        }

        this.send = function(message) {

            var payload = JSON.stringify(message);
            //console.log('Sending message via socket.');
            socket.send(payload);
        }
    }
});