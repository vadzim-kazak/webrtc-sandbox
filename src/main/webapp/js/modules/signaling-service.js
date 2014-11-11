/**
 * Created by Vadim on 11/10/2014.
 */
/**
 * Created by Kazak_VV on 10.11.2014.
 */
define(['modules/web-socket'], function(WebSocketWrapper) {

    return function (webSocketUrl) {

        /** **/
        this.onOfferHandler;

        /** **/
        this.onAnswerHandler;

        /** **/
        var context = this;

        var webSocket = new WebSocketWrapper(webSocketUrl);

        this.sendOffer = function (offerSdp) {

            var offer = {
                type: 'offer',
                payload: offerSdp
            }

            webSocket.send(offer);
        }

        this.sendAnswer = function (answerSdp) {

            var answer = {
                type: 'answer',
                payload: answerSdp
            }

            webSocket.send(answer);
        }

        webSocket.onSocketMessageHandler = function (webSocketMessage) {

            var message = JSON.parse(webSocketMessage.data);
            var payload = message.payload;
            var type = message.type;

            if (type == 'offer' && context.onOfferHandler) {
                console.log('Received offer message');
                context.onOfferHandler(payload);

            } else if (type == 'answer' && context.onAnswerHandler) {
                console.log('Received answer message');
                context.onAnswerHandler(payload)
            }
        }

    }

});