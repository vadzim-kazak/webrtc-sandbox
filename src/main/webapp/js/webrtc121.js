/**
 * Created by Vadim on 11/9/2014.
 */

var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

var socket;
var pc;

$(document).ready(function() {

        socket = new WebSocket("ws://192.168.0.104:8085/websocket");

        socket.onopen = function(){
            console.log('Socket has been opened...');
        }

        socket.onclose = function(){
            console.log('Socket has been closed...');
        }

        socket.onmessage = function (socketMessage){

            var message = JSON.parse(socketMessage.data);
            var payload = JSON.parse(message.payload);
            if (message.type == "candidate") {
                console.log("Remote ice candidate recieved: " + message.payload);
                var iceCandidate = new IceCandidate(payload);
                peerConnection.addIceCandidate(iceCandidate);
            } else if(message.type == "offer") {
                console.log("Remote local description recieved: " + message.payload);
                peerConnection.setRemoteDescription(new SessionDescription(payload), function() {
                    peerConnection.createAnswer(function(answerSDP) {
                        peerConnection.setLocalDescription(answerSDP, function() {
                            sendLocalDescription('answer', answerSDP);
                        })
                    })
                });
            } else if (message.type == "answer") {
                peerConnection.setRemoteDescription(new SessionDescription(payload));
            }
        }

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

        peerConnection = new PeerConnection(configuration, options);
        peerConnection.addStream(stream);

        peerConnection.onicecandidate = function (event) {
            console.log("onicecandidate callback");
            if (event.candidate) {

                socket.send(JSON.stringify({
                    type: "candidate",
                    payload: JSON.stringify(event.candidate)
                }));

                // Get only first ice candidate
                peerConnection.onicecandidate = null;

            } else {
                console.error("Couldn't get self ice candidate");
            }
        };

        peerConnection.onaddstream = function(event){
            document.getElementById("otherPeer").src = URL.createObjectURL(event.stream);
        }

    }, onErrorHandler);

    function onErrorHandler(error) {
        console.error("getUserMedia error", error)
    }
}

function createOffer() {

    console.log("Invocation of createOffer function");

        peerConnection.createOffer(function (offerSDP) {
            console.log("Create offerSDP callback");
            peerConnection.setLocalDescription(offerSDP);
            sendLocalDescription('offer', offerSDP);
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

function sendLocalDescription(type, offer) {
    socket.send(JSON.stringify({
        type: type,
        payload: JSON.stringify(offer)
    }));
}







