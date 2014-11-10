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
        this.onSocketMessageHandler;

        /** **/
        this.onSocketClosedHandler;

        /** **/
        this.onSocketNotSupportedHandler;

        /** **/
        var socket;

        $(document).ready(function() {

            if ('WebSocket' in window) {

                socket = new WebSocket(socketUrl);

                socket.onopen = function(){
                    console.log('Socket has been opened...');
                    if (this.onSocketOpenedHandler) {
                        onSocketOpenedHandler();
                    }
                }

                socket.onclose = function(closeEvent){
                    console.log('Socket has been closed...');
                    if (this.onSocketClosedHandler) {
                        onSocketClosedHandler();
                    }

                    // Safari case handler
                    if (!closeEvent.wasClean) {
                        console.error('Socket not supported error');
                        if (this.onSocketNotSupportedHandler) {
                            onSocketNotSupportedHandler();
                        }
                    }
                }

                socket.onmessage = function (event){
                     console.log('Proceed socket message: ' + JSON.stringify(event));
                     if (this.onSocketMessageHandler) {
                         onSocketMessageHandler(event);
                     }
                }

            } else {

                console.error('Socket not supported error');
                if (this.onSocketNotSupportedHandler) {
                    onSocketNotSupportedHandler();
                }
            }

            this.send = function(message) {

                var payload = JSON.stringify(message);
                console.error('Sending message via socket: ' + payload);
                socket.send(payload);
            }
        });
    }
});