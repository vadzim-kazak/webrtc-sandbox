/**
 * Created by Vadim on 11/11/2014.
 */

require(['jquery', 'modules/signaling-service', 'modules/web-rtc-connection'], function($, SignalingService, WebRtcConnection) {

        $(document).ready(function() {


            var webRtcConnection = new WebRtcConnection();

            var signalingService = new SignalingService('ws://192.168.0.104:8085/kurentoSocket');
            //var signalingService = new SignalingService('ws://172.16.13.153:8085/websocket');
            webRtcConnection.setSignalingService(signalingService);
            webRtcConnection.incomingStreamHandler = function (event) {
                $('#otherPeer')[0].src = URL.createObjectURL(event.stream);
            }


            $('#startStreaming').click(function() {
                webRtcConnection.startStreaming($('#preview')[0]);
            });

            $('#callButton').click(function() {
                webRtcConnection.shareStream();
            });
        });
    }
)
