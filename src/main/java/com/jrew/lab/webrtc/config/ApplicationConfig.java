package com.jrew.lab.webrtc.config;

import org.kurento.client.factory.KurentoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

/**
 * Created by Kazak_VV on 26.09.2014.
 */
@Configuration
@ComponentScan(basePackages = "com.jrew.lab.webrtc")
@PropertySource("classpath:config.properties")
public class ApplicationConfig {

    /** **/
    @Value("${kms.host}")
    private String kmsHost;

    /** **/
    @Value("${kms.port}")
    private String kmsPort;

    // Property source configurer
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    // Kms client
    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create("ws://" + kmsHost + ':' + kmsPort + "/kurento");
    }

}
