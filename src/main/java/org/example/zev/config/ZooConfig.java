package org.example.zev.config;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.ExponentialBackoffRetry;
import org.example.zev.property.ZooProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({ZooProperties.class})
public class ZooConfig {

    @Bean
    public CuratorFramework zoo(final ZooProperties zooProperties) throws InterruptedException {
        final var result = CuratorFrameworkFactory.builder()
                .connectString(zooProperties.connectionString())
                .retryPolicy(new ExponentialBackoffRetry(zooProperties.baseSleepMs(), zooProperties.maxRetries()))
                .build();

        result.start();
        result.blockUntilConnected();

        return result;
    }
}
