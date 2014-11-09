package com.jrew.lab.webrtc.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

/**
 * Created by Kazak_VV on 30.07.2014.
 */
@Controller
public class WebSocketController extends TextWebSocketHandler {

    /** **/
    private Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    /** **/
    private List<WebSocketSession> webSessions = new ArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        logger.debug("Connection has been established. Session id = {}", session.getId());
        webSessions.add(session);
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        final String socketPayload = message.getPayload().toString();
        logger.debug("Following message for session id = {} has been received: {}", session.getId(), socketPayload);

        webSessions.stream().filter(webSession -> !webSession.getId().equalsIgnoreCase(session.getId())).forEach(
                webSession -> {
                    try {
                        webSession.sendMessage(new TextMessage(socketPayload));
                    } catch (IOException exception) {
                        logger.error("Couldn't send message via web socket", exception);
                    }
                }
        );
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
