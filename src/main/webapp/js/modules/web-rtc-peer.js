/**
 * Created by Kazak_VV on 10.11.2014.
 */
define(['modules/web-rtc-config'], function(configuration) {

    return function () {

        /** **/
        this.incomingStreamHandler;

        /**
         * It is assumed that signaling service has two methods:
         * sendOffer(offerSdp)
         * sendAnswer(answerSdp)
         * and two public properties:
         * onOfferHandler
         * onAnswerHandler
         **/
        var signalingService;

        /** **/
        var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

        /** **/
        var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;

        /** **/
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

        /** **/
        var peerConnection;

        /** **/
        var isIceNegotiationCompleted = false;

        /**
         *
         * @param selfVideoContainer
         */
        this.startStreaming = function (selfVideoContainer) {

            var mediaOptions = {
                video: true,
                audio: true
            };

            var getUserMediaErrorHandler = function (error) {
                console.error("getUserMedia error.", error)
            }

            navigator.getUserMedia(mediaOptions, function (stream) {

                console.log("Starting video streaming.");
                selfVideoContainer.src = URL.createObjectURL(stream);

                var options = {
                    optional: [
                        {DtlsSrtpKeyAgreement: true},
                        {RtpDataChannels: true}
                    ]
                }

                peerConnection = new PeerConnection(configuration, options);
                peerConnection.addStream(stream);

                /*
                    Callback will be triggered automatically only after offer creation (shareStream function invocation).
                    It is need to wait until all ICE data is gathered and after send offer to signaling server
                */
                peerConnection.onicecandidate = function (event) {
                    console.log("onicecandidate callback.");

                    if (event.candidate) {
                        isIceNegotiationCompleted = false;
                        return;
                    }

                    if (isIceNegotiationCompleted) {
                        return;
                    }

                    console.log('ICE negotiation completed.');
                    isIceNegotiationCompleted = true;

                    sendOffer();
                };

                peerConnection.onaddstream = function(event){
                    if (incomingStreamHandler) {
                        console.log('Processing onaddstream event.');
                        incomingStreamHandler(event);
                    }
                }

            }, getUserMediaErrorHandler);
        };

        /**
         *
         */
        this.shareStream = function () {

            console.log("Perform share stream action.");

            var errorHandler = function (error) {
                console.error(error);
            };

            var constraints = {
                mandatory: {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true
                }
            };

            console.log("Creating local stream offer");
            peerConnection.createOffer(function (offerSDP) {

                console.log("Create offerSDP callback");
                peerConnection.setLocalDescription(offerSDP);

            }, errorHandler, constraints);
        }

        this.setSignalingService = function (service) {
            if (service) {
                signalingService = service;
                signalingService.onOfferHandler = processOffer;
                signalingService.onAnswerHandler = processAnswer;
            }
        }

        /**
         *
         */
        var sendOffer = function () {
            if (signalingService) {
                console.log("Sending offer SDP.");
                signalingService.sendOffer(peerConnection.localDescription.sdp);
            } else {
                console.log("Please specify signaling processor in order to send offer sdp.");
            }
        }

        /**
         *
         * @param answerSDP
         */
        var processAnswer = function (answerSdp) {
            console.log("Setting remote session description.");
            peerConnection.setRemoteDescription(new SessionDescription(answerSdp));
        }

        /**
         *
         * @param offerSdp
         */
        var processOffer = function (offerSdp) {
            console.log("Setting remote session description.");
            peerConnection.setRemoteDescription(new SessionDescription(offerSdp), function() {
                peerConnection.createAnswer(function(answerSDP) {
                    console.log("Setting local session description.");
                    peerConnection.setLocalDescription(answerSDP, function() {
                        signalingService.sendAnswer(answerSDP);
                    })
                })
            });
        }

    }
});