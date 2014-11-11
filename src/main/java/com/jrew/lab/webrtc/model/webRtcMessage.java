package com.jrew.lab.webrtc.model;

/**
 * Created with IntelliJ IDEA.
 * User: Vadim
 * Date: 11/11/2014
 * Time: 10:16 PM
 */
public class WebRtcMessage {

    private String type;

    private String payload;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }
}
