////package in.bushansirgur.foodiesapi.controller;
////
////public class AIController {
////}
//
//package in.bushansirgur.foodiesapi.controller;
//
//import in.bushansirgur.foodiesapi.io.AIRequest;
//import in.bushansirgur.foodiesapi.io.AIResponse;
//import in.bushansirgur.foodiesapi.service.AIService;
//import lombok.AllArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.server.ResponseStatusException;
//
//@AllArgsConstructor
//@RestController
//@RequestMapping("/api/ai")
//@CrossOrigin(origins = {
//        "http://localhost:5173",
//        "http://localhost:5174"
//})
//public class AIController {
//
//    private final AIService aiService;
//
//    @PostMapping("/chat")
//    public AIResponse chat(@RequestBody AIRequest request) {
//
//        if (request == null ||
//                request.getMessage() == null ||
//                request.getMessage().trim().isEmpty()) {
//
//            throw new ResponseStatusException(
//                    HttpStatus.BAD_REQUEST,
//                    "Message cannot be empty."
//            );
//        }
//
//        return aiService.chat(request);
//    }
//
//    @GetMapping("/health")
//    public String health() {
//        return "Foodies AI Service is Running Successfully.";
//    }
//}



package in.bushansirgur.foodiesapi.controller;

import in.bushansirgur.foodiesapi.io.AIRequest;
import in.bushansirgur.foodiesapi.io.AIResponse;
import in.bushansirgur.foodiesapi.service.AIService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AIController {

    private final AIService aiService;

    // Constructor Injection
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public AIResponse chat(@RequestBody AIRequest request) {
        if (request == null
                || request.getMessage() == null
                || request.getMessage().trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot be empty."
            );
        }
        log.info("AI Chat request received: {}", request.getMessage());
        return aiService.chat(request);
    }

    @GetMapping("/health")
    public String health() {
        return "Foodies AI Service is Running Successfully.";
    }
}