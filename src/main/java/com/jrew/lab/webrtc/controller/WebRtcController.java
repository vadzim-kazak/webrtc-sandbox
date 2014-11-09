package com.jrew.lab.webrtc.controller;

import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: Vadim
 * Date: 11/9/2014
 * Time: 1:46 PM
 */
@RestController
@RequestMapping(value = "/webrtc")
public class WebRtcController {

    @RequestMapping(method = RequestMethod.POST)
    private String processRequest(@RequestBody String sdpOffer) throws IOException {

//        // Media Logic
//        MediaPipeline pipeline = kurentoClient.createMediaPipeline();
//        WebRtcEndpoint webRtcEndpoint = new WebRtcEndpoint.Builder(pipeline).build();
//        webRtcEndpoint.connect(webRtcEndpoint);
//
//        // SDP negotiation (offer and answer)
//        String responseSdp = webRtcEndpoint.processOffer(sdpOffer);
//        return responseSdp;

        return null;
    }

}
