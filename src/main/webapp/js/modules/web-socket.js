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

        $(document).ready(function() {

            if ('WebSocket' in window) {

                var socket = new WebSocket(socketUrl);

                socket.onopen = function(){
                    console.log('Socket has been opened...');
                    if (onSocketOpenedHandler) {
                        onSocketOpenedHandler();
                    }
                }

                socket.onclose = function(closeEvent){
                    console.log('Socket has been closed...');
                    if (onSocketClosedHandler) {
                        onSocketClosedHandler();
                    }

                    // Safari hack
                    if (!closeEvent.wasClean) {
                        console.error('Socket not supported error');
                        if (onSocketNotSupportedHandler) {
                            onSocketNotSupportedHandler();
                        }
                    }
                }

                socket.onmessage = function (event){
                     console.log('Proceed socket message: ' + JSON.stringify(event));
                     if (onSocketMessageHandler) {
                         onSocketMessageHandler(event);
                     }
                }

            } else {

                console.error('Socket not supported error');
                if (onSocketNotSupportedHandler) {
                    onSocketNotSupportedHandler();
                }
            }
        });
    }
});