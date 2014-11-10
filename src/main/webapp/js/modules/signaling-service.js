/**
 * Created by Vadim on 11/10/2014.
 */
/**
 * Created by Kazak_VV on 10.11.2014.
 */
define(['modules/web-socket'], function(WebSocket) {

    return function (webSocketUrl) {

        /** **/
        this.onOfferHandler;

        /** **/
        this.onAnswerHandler;

        var webSocket = new WebSocket(webSocketUrl);

        this.sendOffer = function (offerSdp) {

            var offer = {
                type: 'offer',
                payload: JSON.stringify(offerSdp)
            }

            webSocket.send(offer);
        }

        this.sendAnswer = function (answerSdp) {

            var answer = {
                type: 'answer',
                payload: JSON.stringify(answerSdp)
            }

            webSocket.send(answer);
        }

        webSocket.onSocketMessageHandler = function (webSocketMessage) {

            var message = JSON.parse(webSocketMessage);
            var payload = message.payload;

            if (type == 'offer' && onOfferHandler) {
                console.log('Received offer message');
                onOfferHandler(payload);

            } else if (type == 'answer' && onAnswerHandler) {
                console.log('Received answer message');
                onAnswerHandler(payload)
            }
        }


    }

});