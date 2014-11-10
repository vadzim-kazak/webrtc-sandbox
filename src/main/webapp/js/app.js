/**
 * Created by Kazak_VV on 21.08.2014.
 */

require(['jquery', 'modules/signaling-service', 'modules/web-rtc-peer'], function($, SignalingService, WebRtcPeer) {

        $(document).ready(function() {


        var webRtcPeer = new WebRtcPeer();

        var signalingService = new SignalingService('ws://192.168.0.104:8085/websocket');
        webRtcPeer.setSignalingService(signalingService);
        webRtcPeer.incomingStreamHandler = function (event) {
            $('#otherPeer').src = URL.createObjectURL(event.stream);
        }


        $('#startStreaming').click(function() {
            webRtcPeer.startStreaming($('#preview')[0]);
        });

        $('#callButton').click(function() {
            webRtcPeer.shareStream();
        });
    });
    }
);