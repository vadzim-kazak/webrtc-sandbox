/**
 * Created by Kazak_VV on 10.11.2014.
 */
define(function() {
    return {
        iceServers: [
            {url: "stun:23.21.150.121"},
            {url: "stun:stun.l.google.com:19302"},
            {url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com"}
        ]
    }
});