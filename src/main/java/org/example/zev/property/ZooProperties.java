package org.example.zev.property;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("zoo")
public record ZooProperties(String connectionString, int baseSleepMs, int maxRetries) {
    public ZooProperties() {
        this("localhost:2181", 1000, 100);
    }
}
