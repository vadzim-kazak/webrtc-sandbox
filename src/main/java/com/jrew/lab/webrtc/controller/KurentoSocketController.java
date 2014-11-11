package com.jrew.lab.webrtc.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.jrew.lab.webrtc.model.WebRtcMessage;
import org.kurento.client.FaceOverlayFilter;
import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.kurento.client.factory.KurentoClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

/**
 * Created with IntelliJ IDEA.
 * User: Vadim
 * Date: 11/11/2014
 * Time: 10:07 PM
 */
@Controller
@Qualifier("kurento")
public class KurentoSocketController extends TextWebSocketHandler {

    /** **/
    private Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    /** **/
    private List<WebSocketSession> webSessions = new ArrayList<>();

    @Autowired
    private KurentoClient kurento;

    private ObjectMapper mapper;

    @PostConstruct
    private void init() {
        mapper = new ObjectMapper();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        logger.debug("Connection has been established. Session id = {}", session.getId());
        webSessions.add(session);
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        final String socketPayload = message.getPayload().toString();
        logger.debug("Following message for session id = {} has been received: {}", session.getId(), socketPayload);


        MediaPipeline pipeline = kurento.createMediaPipeline();
        WebRtcEndpoint webRtcEndpoint = new WebRtcEndpoint.Builder(pipeline)
                .build();
        FaceOverlayFilter faceOverlayFilter = new FaceOverlayFilter.Builder(
                pipeline).build();
        faceOverlayFilter.setOverlayedImage(
                "http://files.kurento.org/imgs/mario-wings.png", -0.35F,
                -1.2F, 1.6F, 1.6F);

        webRtcEndpoint.connect(faceOverlayFilter);
        faceOverlayFilter.connect(webRtcEndpoint);


        WebRtcMessage webRtcMessage = mapper.readValue((String) message.getPayload(), WebRtcMessage.class);

        // SDP negotiation (offer and answer)
        String sdpAnswer = webRtcEndpoint.processOffer(webRtcMessage.getPayload());

        WebRtcMessage answer = new WebRtcMessage();
        answer.setType("answer");
        answer.setPayload(sdpAnswer);

        session.sendMessage(new TextMessage(mapper.writeValueAsString(answer)));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.debug("Connection has been closed. Session id = {}", session.getId());
        ListIterator<WebSocketSession> iterator = webSessions.listIterator();
        while (iterator.hasNext()) {
            WebSocketSession next = iterator.next();
            if (next.getId().equalsIgnoreCase(session.getId())) {
                iterator.remove();
            }
        }
    }

}
