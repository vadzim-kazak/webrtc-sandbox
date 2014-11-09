/**
 * Created by Vadim on 11/9/2014.
 */

var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

var pc;

$(document).ready(function() {

    showLocalVideo();
});

function showLocalVideo() {

    var mediaOptions = {
        video: true,
        audio: true
    };

    navigator.getUserMedia(mediaOptions, function (stream) {

        console.log("Setting local video stream to preview");

        var video = document.getElementById("preview");
        video.src = URL.createObjectURL(stream);

        console.log("Creating new peer connection");

        var configuration = {
            iceServers: [
                {url: "stun:23.21.150.121"},
                {url: "stun:stun.l.google.com:19302"},
                {url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com"}
            ]
        }

        var options = {
            optional: [
                {DtlsSrtpKeyAgreement: true},
                {RtpDataChannels: true}
            ]
        }

        pc = new PeerConnection(configuration, options);
        pc.addStream(stream);

        var ended = false;
        pc.onicecandidate = function (event) {
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

        pc.onaddstream = function(event){
            document.getElementById("otherPeer").src = URL.createObjectURL(event.stream);
        }

    }, onErrorHandler);

    function onErrorHandler(error) {
        console.error("getUserMedia error", error)
    }
}

function createOffer() {

    console.log("Invocation of createOffer function");

    pc.createOffer(function (offerSDP) {
        console.log("Create offerSDP callback");
        pc.setLocalDescription(offerSDP);
    }, errorHandler, constraints);


    var errorHandler = function (err) {
        console.error(err);
    };

    var constraints = {
        mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        }
    };

}

function sendOffer() {

    $.ajax({
        url : location.protocol + '/test',
        type : 'POST',
        dataType : 'text',
        contentType : 'application/sdp',
        data : pc.localDescription.sdp,
        success : function(answerSDP) {
            console.log("Received answerSDP from server. Processing ...");

            var answer = new SessionDescription({
                type : 'answer',
                sdp : answerSDP
            });

            pc.setRemoteDescription(answer);
        },
        error : function(jqXHR, textStatus, error) {
            onError(error);
        }
    });
}







