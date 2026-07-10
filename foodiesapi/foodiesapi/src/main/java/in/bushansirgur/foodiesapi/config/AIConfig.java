//package in.bushansirgur.foodiesapi.config;
//
//public class AIConfig {
//}
//package in.bushansirgur.foodiesapi.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.client.RestTemplate;
//
//@Configuration
//public class AIConfig {
//
//    @Bean
//    public RestTemplate restTemplate() {
//        return new RestTemplate();
//    }
//
//}
//
//package in.bushansirgur.foodiesapi.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.client.RestTemplate;
//
//@Configuration
//public class AIConfig {
//
//    @Bean
//    public RestTemplate restTemplate() {
//        return new RestTemplate();
//    }
//}


package in.bushansirgur.foodiesapi.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class AIConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                // Time to establish the TCP connection to Ollama.
                // Fails fast (instead of hanging) if Ollama isn't running.
                .connectTimeout(Duration.ofSeconds(5))
                // Time to wait for Ollama to actually generate and return
                // a response. LLM generation can be slow on CPU, so this
                // is generous — tune down if you want faster failure.
                .readTimeout(Duration.ofSeconds(300))
                .build();
    }
}