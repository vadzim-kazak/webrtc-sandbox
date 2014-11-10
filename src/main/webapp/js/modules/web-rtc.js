/**
 * Created by Kazak_VV on 10.11.2014.
 */
define(['web-rtc-config'], function(configuration) {

    return function (localVideo, remoteVideo) {

        /** **/
        var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

        /** **/
        var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

        /** **/
        var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;

        /** **/
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

        /** **/
        var peerConnection;

        var mediaOptions = {
            video: true,
            audio: true
        };

        navigator.getUserMedia(mediaOptions, function (stream) {

            console.log("Starting to show local video stream.");
            localVideo.src = URL.createObjectURL(stream);

            var options = {
                optional: [
                    {DtlsSrtpKeyAgreement: true},
                    {RtpDataChannels: true}
                ]
            }

            peerConnection = new PeerConnection(configuration, options);
            peerConnection.addStream(stream);

            var ended = false;
            peerConnection.onicecandidate = function (event) {
                console.log("onicecandidate callback");

                if (event.candidate) {
                    ended = false;
                    return;
                }

                if (ended) {
                    return;
                }

                console.log('ICE negotiation completed');
                sendOffer();

                ended = true;
            };

            peerConnection.onaddstream = function(event){
                document.getElementById("otherPeer").src = URL.createObjectURL(event.stream);
            }

        }, function ());

        function onErrorHandler(error) {
            console.error("getUserMedia error", error)
        }

    }

});