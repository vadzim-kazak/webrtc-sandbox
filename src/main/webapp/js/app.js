/**
 * Created by Kazak_VV on 21.08.2014.
 */

require(['jquery', 'modules/signaling-service', 'modules/web-rtc-connection'], function($, SignalingService, WebRtcConnection) {

        $(document).ready(function() {


        var webRtcConnection = new WebRtcConnection();

        //var signalingService = new SignalingService('ws://192.168.0.104:8085/websocket');
        var signalingService = new SignalingService('ws://172.16.13.153:8085/websocket');
        webRtcConnection.setSignalingService(signalingService);
        webRtcConnection.incomingStreamHandler = function (event) {

            var video = $('<video />', {class: 'remoteVideo'});
            video.addClass("remoteVideo").attr('autoplay','');
            video[0].src = URL.createObjectURL(event.stream);

            $('#otherPeersContainer').append(video);

        }


        $('#startStreaming').click(function() {
            webRtcConnection.startStreaming($('#preview')[0]);
        });

        $('#callButton').click(function() {
            webRtcConnection.shareStream();
        });
    });
    }
);