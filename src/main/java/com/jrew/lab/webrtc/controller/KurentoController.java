package com.jrew.lab.webrtc.controller;

import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.kurento.client.factory.KurentoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Created by Kazak_VV on 06.11.2014.
 */
@RestController
@RequestMapping(value = "/")
public class KurentoController {

    @Autowired
    private KurentoClient kurentoClient;

    @RequestMapping(value = "test", method = RequestMethod.POST)
    private String processRequest(@RequestBody String sdpOffer) throws IOException {

        // Media Logic
        MediaPipeline pipeline = kurentoClient.createMediaPipeline();
        WebRtcEndpoint webRtcEndpoint = new WebRtcEndpoint.Builder(pipeline).build();
        webRtcEndpoint.connect(webRtcEndpoint);

        // SDP negotiation (offer and answer)
        String responseSdp = webRtcEndpoint.processOffer(sdpOffer);
        return responseSdp;
    }

}
