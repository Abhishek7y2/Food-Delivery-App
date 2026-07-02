//package in.bushansirgur.foodiesapi.service;
//
//public class AIServiceImpl {
//}

package in.bushansirgur.foodiesapi.service;

import in.bushansirgur.foodiesapi.entity.FoodEntity;
import in.bushansirgur.foodiesapi.io.AIRequest;
import in.bushansirgur.foodiesapi.io.AIResponse;
import in.bushansirgur.foodiesapi.io.OllamaRequest;
import in.bushansirgur.foodiesapi.io.OllamaResponse;
import in.bushansirgur.foodiesapi.repository.FoodRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AIServiceImpl implements AIService {

    private final FoodRepository foodRepository;
    private final RestTemplate restTemplate;

    @Value("${ollama.api.url}")
    private String ollamaApiUrl;

    @Value("${ollama.model}")
    private String ollamaModel;

    public AIServiceImpl(
            FoodRepository foodRepository,
            RestTemplate restTemplate
    ) {
        this.foodRepository = foodRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public AIResponse chat(AIRequest request) {

        log.info("User Message : {}", request.getMessage());

        List<FoodEntity> allFoods = foodRepository.findAll();

        if (allFoods.isEmpty()) {

            return AIResponse.builder()
                    .reply("Sorry, Foodies menu is currently unavailable.")
                    .recommendedFoods(List.of())
                    .action("NONE")
                    .foodId(null)
                    .build();

        }

        List<FoodEntity> filteredFoods =
                filterFoodsByMessage(
                        request.getMessage(),
                        allFoods
                );

        if (filteredFoods.isEmpty()) {
            filteredFoods = allFoods;
        }

        String prompt = buildPrompt(
                request.getMessage(),
                filteredFoods
        );

        String aiReply = callOllama(prompt);

        List<String> recommendations =
                filteredFoods.stream()
                        .limit(5)
                        .map(FoodEntity::getName)
                        .collect(Collectors.toList());

        return AIResponse.builder()
                .reply(aiReply)
                .recommendedFoods(recommendations)
                .action("RECOMMEND")
                .foodId(null)
                .build();

    }

    // ==========================================================
    // Filter Foods According To User Message
    // ==========================================================
    private List<FoodEntity> filterFoodsByMessage(String message,
                                                  List<FoodEntity> foods) {

        String msg = message.toLowerCase();

        return foods.stream()

                .filter(food -> {

                    String category = nullSafe(food.getCategory()).toLowerCase();
                    String name = nullSafe(food.getName()).toLowerCase();
                    String description = nullSafe(food.getDescription()).toLowerCase();

                    String combined = name + " " + category + " " + description;

                    // --------------------------------------------------
                    // Category Filters
                    // --------------------------------------------------

                    if (msg.contains("biryani"))
                        return category.equals("biryani");

                    if (msg.contains("burger"))
                        return category.equals("burger");

                    if (msg.contains("pizza"))
                        return category.equals("pizza");

                    if (msg.contains("roll"))
                        return category.equals("rolls");

                    if (msg.contains("salad"))
                        return category.equals("salad");

                    if (msg.contains("cake"))
                        return category.equals("cake");

                    if (msg.contains("ice cream"))
                        return category.equals("ice cream");

                    // --------------------------------------------------
                    // Healthy Foods
                    // --------------------------------------------------

                    if (msg.contains("healthy")
                            || msg.contains("diet")
                            || msg.contains("weight loss")
                            || msg.contains("low calorie")) {

                        return category.equals("salad");

                    }

                    // --------------------------------------------------
                    // High Protein
                    // --------------------------------------------------

                    if (msg.contains("protein")
                            || msg.contains("gym")
                            || msg.contains("muscle")) {

                        return combined.contains("chicken")
                                || combined.contains("paneer");

                    }

                    // --------------------------------------------------
                    // Spicy
                    // --------------------------------------------------

                    if (msg.contains("spicy")
                            || msg.contains("hot")) {

                        return category.equals("biryani")
                                || category.equals("rolls")
                                || category.equals("burger");

                    }

                    // --------------------------------------------------
                    // Sweet
                    // --------------------------------------------------

                    if (msg.contains("sweet")
                            || msg.contains("dessert")) {

                        return category.equals("cake")
                                || category.equals("ice cream");

                    }

                    // --------------------------------------------------
                    // Budget
                    // --------------------------------------------------

                    if (msg.contains("cheap")
                            || msg.contains("budget")
                            || msg.contains("under 100")) {

                        return food.getPrice() <= 100;

                    }

                    if (msg.contains("under 200")) {

                        return food.getPrice() <= 200;

                    }

                    if (msg.contains("under 300")) {

                        return food.getPrice() <= 300;

                    }

                    if (msg.contains("under 500")) {

                        return food.getPrice() <= 500;

                    }

                    return false;

                })

                .collect(Collectors.toList());

    }


    // ==========================================================
    // Prompt Builder
    // ==========================================================

    private String buildPrompt(String userMessage,
                               List<FoodEntity> foods) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are Foodies AI.

Foodies is an Indian Food Delivery Application.

You are NOT ChatGPT.

You are Foodies' personal food assistant.

IMPORTANT RULES

1. Recommend ONLY foods available below.

2. Never invent food.

3. Mention food price.

4. Mention category.

5. Keep response short.

6. Use emojis.

7. End with:
"Would you like to order one of these? 😊"

AVAILABLE MENU

""");

        for (FoodEntity food : foods) {

            prompt.append("Food Name : ")
                    .append(food.getName())
                    .append("\n");

            prompt.append("Category : ")
                    .append(food.getCategory())
                    .append("\n");

            prompt.append("Price : ₹")
                    .append(food.getPrice())
                    .append("\n");

            prompt.append("Description : ")
                    .append(food.getDescription())
                    .append("\n\n");

        }

        prompt.append("Customer Question : ")
                .append(userMessage)
                .append("\n");

        return prompt.toString();

    }

    // ==========================================================
    // Call Ollama API
    // ==========================================================
    //
    // Improvements made here vs. the original:
    //
    // 1. No more leaking raw Java/network exception text (e.g.
    //    "I/O error on POST request... Connection refused") into
    //    the chat bubble the end user sees. Users now get a clean,
    //    branded fallback message, while YOU still get the full
    //    stack trace in the server logs via log.error(...).
    //
    // 2. Exceptions are split into specific cases so the log line
    //    (and, in dev, the message) tells you exactly what kind of
    //    failure happened:
    //      - ResourceAccessException  -> Ollama isn't reachable at all
    //        (not running / wrong port / firewall) OR the request
    //        timed out.
    //      - RestClientResponseException -> Ollama responded, but with
    //        a non-2xx status (e.g. model not pulled -> 404, bad
    //        request -> 400).
    //      - Generic Exception -> anything else (e.g. bad JSON mapping).
    //
    // 3. Timeouts are enforced (configured on the RestTemplate bean,
    //    see AIConfig.java below) so a hung/overloaded Ollama process
    //    can't block a request thread forever.
    // ==========================================================

    private String callOllama(String prompt) {

        try {

            OllamaRequest request = OllamaRequest.builder()
                    .model(ollamaModel)
                    .prompt(prompt)
                    .stream(false)
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<OllamaRequest> entity =
                    new HttpEntity<>(request, headers);

            ResponseEntity<OllamaResponse> response =
                    restTemplate.exchange(
                            ollamaApiUrl,
                            HttpMethod.POST,
                            entity,
                            OllamaResponse.class
                    );

            if (response.getStatusCode() == HttpStatus.OK
                    && response.getBody() != null
                    && response.getBody().getResponse() != null) {

                return response.getBody()
                        .getResponse()
                        .trim();

            }

            log.warn("Ollama returned an unexpected empty/non-OK response: {}", response.getStatusCode());
            return "Sorry, I couldn't generate a response right now. 🍽️";

        } catch (ResourceAccessException ex) {
            // Connection refused, host unreachable, or read/connect timeout.
            // Most common cause during development: Ollama isn't running,
            // or ollama.api.url in application.properties is wrong.
            log.error("Could not reach Ollama at {}. Is it running (`ollama serve`) and is the model pulled? Details: {}",
                    ollamaApiUrl, ex.getMessage(), ex);
            return "⚠️ Foodies AI is currently unavailable. Please try again in a moment! 🙏";

        } catch (RestClientResponseException ex) {
            // Ollama process is up and reachable, but returned an error
            // status (e.g. model not found -> pull it with `ollama pull <model>`).
            log.error("Ollama responded with status {} - body: {}",
                    ex.getRawStatusCode(), ex.getResponseBodyAsString(), ex);
            return "⚠️ Foodies AI hit a snag processing that. Please try again! 🙏";

        } catch (Exception ex) {
            // Catch-all for anything unforeseen (bad JSON deserialization, etc.)
            log.error("Unexpected error while calling Ollama", ex);
            return "⚠️ Foodies AI is currently unavailable. Please try again later.";
        }

    }


    // ==========================================================
    // Null Safe
    // ==========================================================

    private String nullSafe(String value) {

        if (value == null) {
            return "";
        }

        return value;

    }

}




/*

package in.bushansirgur.foodiesapi.service;

import in.bushansirgur.foodiesapi.entity.FoodEntity;
import in.bushansirgur.foodiesapi.io.AIRequest;
import in.bushansirgur.foodiesapi.io.AIResponse;
import in.bushansirgur.foodiesapi.io.OllamaRequest;
import in.bushansirgur.foodiesapi.io.OllamaResponse;
import in.bushansirgur.foodiesapi.repository.FoodRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AIServiceImpl implements AIService {

    private final FoodRepository foodRepository;
    private final RestTemplate restTemplate;

    @Value("${ollama.api.url}")
    private String ollamaApiUrl;

    @Value("${ollama.model}")
    private String ollamaModel;

    public AIServiceImpl(
            FoodRepository foodRepository,
            RestTemplate restTemplate
    ) {
        this.foodRepository = foodRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public AIResponse chat(AIRequest request) {

        log.info("User Message : {}", request.getMessage());

        List<FoodEntity> allFoods = foodRepository.findAll();

        if (allFoods.isEmpty()) {

            return AIResponse.builder()
                    .reply("Sorry, Foodies menu is currently unavailable.")
                    .recommendedFoods(List.of())
                    .action("NONE")
                    .foodId(null)
                    .build();

        }

        List<FoodEntity> filteredFoods =
                filterFoodsByMessage(
                        request.getMessage(),
                        allFoods
                );

        if(filteredFoods.isEmpty()){
            filteredFoods = allFoods;
        }

        String prompt = buildPrompt(
                request.getMessage(),
                filteredFoods
        );

        String aiReply = callOllama(prompt);

        List<String> recommendations =
                filteredFoods.stream()
                        .limit(5)
                        .map(FoodEntity::getName)
                        .collect(Collectors.toList());

        return AIResponse.builder()
                .reply(aiReply)
                .recommendedFoods(recommendations)
                .action("RECOMMEND")
                .foodId(null)
                .build();

    }

    // ==========================================================
    // Filter Foods According To User Message
    // ==========================================================
    private List<FoodEntity> filterFoodsByMessage(String message,
                                                  List<FoodEntity> foods) {

        String msg = message.toLowerCase();

        return foods.stream()

                .filter(food -> {

                    String category = nullSafe(food.getCategory()).toLowerCase();
                    String name = nullSafe(food.getName()).toLowerCase();
                    String description = nullSafe(food.getDescription()).toLowerCase();

                    String combined = name + " " + category + " " + description;

                    // --------------------------------------------------
                    // Category Filters
                    // --------------------------------------------------

                    if (msg.contains("biryani"))
                        return category.equals("biryani");

                    if (msg.contains("burger"))
                        return category.equals("burger");

                    if (msg.contains("pizza"))
                        return category.equals("pizza");

                    if (msg.contains("roll"))
                        return category.equals("rolls");

                    if (msg.contains("salad"))
                        return category.equals("salad");

                    if (msg.contains("cake"))
                        return category.equals("cake");

                    if (msg.contains("ice cream"))
                        return category.equals("ice cream");

                    // --------------------------------------------------
                    // Healthy Foods
                    // --------------------------------------------------

                    if (msg.contains("healthy")
                            || msg.contains("diet")
                            || msg.contains("weight loss")
                            || msg.contains("low calorie")) {

                        return category.equals("salad");

                    }

                    // --------------------------------------------------
                    // High Protein
                    // --------------------------------------------------

                    if (msg.contains("protein")
                            || msg.contains("gym")
                            || msg.contains("muscle")) {

                        return combined.contains("chicken")
                                || combined.contains("paneer");

                    }

                    // --------------------------------------------------
                    // Spicy
                    // --------------------------------------------------

                    if (msg.contains("spicy")
                            || msg.contains("hot")) {

                        return category.equals("biryani")
                                || category.equals("rolls")
                                || category.equals("burger");

                    }

                    // --------------------------------------------------
                    // Sweet
                    // --------------------------------------------------

                    if (msg.contains("sweet")
                            || msg.contains("dessert")) {

                        return category.equals("cake")
                                || category.equals("ice cream");

                    }

                    // --------------------------------------------------
                    // Budget
                    // --------------------------------------------------

                    if (msg.contains("cheap")
                            || msg.contains("budget")
                            || msg.contains("under 100")) {

                        return food.getPrice() <= 100;

                    }

                    if (msg.contains("under 200")) {

                        return food.getPrice() <= 200;

                    }

                    if (msg.contains("under 300")) {

                        return food.getPrice() <= 300;

                    }

                    if (msg.contains("under 500")) {

                        return food.getPrice() <= 500;

                    }

                    return false;

                })

                .collect(Collectors.toList());

    }


    // ==========================================================
    // Prompt Builder
    // ==========================================================

    private String buildPrompt(String userMessage,
                               List<FoodEntity> foods) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are Foodies AI.

Foodies is an Indian Food Delivery Application.

You are NOT ChatGPT.

You are Foodies' personal food assistant.

IMPORTANT RULES

1. Recommend ONLY foods available below.

2. Never invent food.

3. Mention food price.

4. Mention category.

5. Keep response short.

6. Use emojis.

7. End with:
"Would you like to order one of these? 😊"

AVAILABLE MENU

""");

        for (FoodEntity food : foods) {

            prompt.append("Food Name : ")
                    .append(food.getName())
                    .append("\n");

            prompt.append("Category : ")
                    .append(food.getCategory())
                    .append("\n");

            prompt.append("Price : ₹")
                    .append(food.getPrice())
                    .append("\n");

            prompt.append("Description : ")
                    .append(food.getDescription())
                    .append("\n\n");

        }

        prompt.append("Customer Question : ")
                .append(userMessage)
                .append("\n");

        return prompt.toString();

    }
    // ==========================================================
    // Call Ollama API
    // ==========================================================

    private String callOllama(String prompt) {

        try {

            OllamaRequest request = OllamaRequest.builder()
                    .model(ollamaModel)
                    .prompt(prompt)
                    .stream(false)
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<OllamaRequest> entity =
                    new HttpEntity<>(request, headers);

            ResponseEntity<OllamaResponse> response =
                    restTemplate.exchange(
                            ollamaApiUrl,
                            HttpMethod.POST,
                            entity,
                            OllamaResponse.class
                    );

            if (response.getStatusCode() == HttpStatus.OK
                    && response.getBody() != null
                    && response.getBody().getResponse() != null) {

                return response.getBody()
                        .getResponse()
                        .trim();

            }

            return "Sorry, I couldn't generate a response right now. 🍽️";
        }catch (Exception ex) {

            ex.printStackTrace();

            return ex.getMessage();
        }

//        } catch (Exception ex) {
//
//            log.error("Ollama Error", ex);
//
//            return "⚠️ Foodies AI is currently unavailable. Please try again later.";
//
//        }

    }


    // ==========================================================
    // Null Safe
    // ==========================================================

    private String nullSafe(String value) {

        if (value == null) {
            return "";
        }

        return value;

    }

}

*/


//package in.bushansirgur.foodiesapi.service;
//
//import in.bushansirgur.foodiesapi.entity.FoodEntity;
//import in.bushansirgur.foodiesapi.io.AIRequest;
//import in.bushansirgur.foodiesapi.io.AIResponse;
//import in.bushansirgur.foodiesapi.io.OllamaRequest;
//import in.bushansirgur.foodiesapi.io.OllamaResponse;
//import in.bushansirgur.foodiesapi.repository.FoodRepository;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Slf4j
//@Service
//public class AIServiceImpl implements AIService {
//
//    private final FoodRepository foodRepository;
//    private final RestTemplate restTemplate;
//
//    @Value("${ollama.api.url}")
//    private String ollamaApiUrl;
//
//    @Value("${ollama.model}")
//    private String ollamaModel;
//
//    // Constructor Injection (no field injection)
//    public AIServiceImpl(FoodRepository foodRepository,
//                         RestTemplate restTemplate) {
//        this.foodRepository = foodRepository;
//        this.restTemplate = restTemplate;
//    }
//
//    @Override
//    public AIResponse chat(AIRequest request) {
//        log.info("Received AI chat request: {}", request.getMessage());
//
//        // Step 1: Fetch all available foods from MongoDB
//        List<FoodEntity> allFoods = foodRepository.findAll();
//
//        if (allFoods.isEmpty()) {
//            log.warn("No foods found in the database.");
//            return AIResponse.builder()
//                    .reply("Sorry, our menu is currently unavailable. Please try again later!")
//                    .recommendedFoods(List.of())
//                    .action("none")
//                    .build();
//        }
//
//        // Step 2: Filter relevant foods based on user message keywords
//        List<FoodEntity> relevantFoods = filterFoodsByMessage(
//                request.getMessage(), allFoods
//        );
//
//        // Fallback: if no keyword match, use all foods
//        List<FoodEntity> foodsToUse = relevantFoods.isEmpty() ? allFoods : relevantFoods;
//
//        // Step 3: Build dynamic prompt with real food data
//        String prompt = buildPrompt(request.getMessage(), foodsToUse);
//        log.info("Built Ollama prompt for {} foods", foodsToUse.size());
//
//        // Step 4: Call Ollama and get response
//        String ollamaReply = callOllama(prompt);
//        log.info("Ollama response received.");
//
//        // Step 5: Build list of recommended food names
//        List<String> recommendedNames = foodsToUse.stream()
//                .map(FoodEntity::getName)
//                .limit(5)
//                .collect(Collectors.toList());
//
//        return AIResponse.builder()
//                .reply(ollamaReply)
//                .recommendedFoods(recommendedNames)
//                .action("recommend")
//                .build();
//    }
//
//    // ─────────────────────────────────────────────
//    // PRIVATE: Filter foods by user message keywords
//    // ─────────────────────────────────────────────
//    private List<Food> filterFoodsByMessage(String message, List<Food> foods) {
//        String msg = message.toLowerCase();
//
//        return foods.stream().filter(food -> {
//            String name = nullSafe(food.getName());
//            String category = nullSafe(food.getFoodCategory());
//            String description = nullSafe(food.getDescription());
//            String combined = (name + " " + category + " " + description).toLowerCase();
//
//            // Price filters
//            if (msg.contains("under ₹100") || msg.contains("under 100")) {
//                return food.getPrice() != null && food.getPrice() <= 100;
//            }
//            if (msg.contains("under ₹200") || msg.contains("under 200")) {
//                return food.getPrice() != null && food.getPrice() <= 200;
//            }
//            if (msg.contains("under ₹300") || msg.contains("under 300")) {
//                return food.getPrice() != null && food.getPrice() <= 300;
//            }
//            if (msg.contains("under ₹500") || msg.contains("under 500")) {
//                return food.getPrice() != null && food.getPrice() <= 500;
//            }
//            if (msg.contains("budget") || msg.contains("cheap") || msg.contains("affordable")) {
//                return food.getPrice() != null && food.getPrice() <= 200;
//            }
//
//            // Diet/goal keywords
//            if (msg.contains("veg") && !msg.contains("non")) {
//                return food.isVeg();
//            }
//            if (msg.contains("non-veg") || msg.contains("nonveg") || msg.contains("non veg")) {
//                return !food.isVeg();
//            }
//            if (msg.contains("spicy") || msg.contains("hot")) {
//                return combined.contains("spicy") || combined.contains("hot")
//                        || combined.contains("chilli") || combined.contains("pepper");
//            }
//            if (msg.contains("sweet") || msg.contains("dessert") || msg.contains("cake")) {
//                return combined.contains("sweet") || combined.contains("cake")
//                        || combined.contains("ice cream") || combined.contains("dessert");
//            }
//            if (msg.contains("protein") || msg.contains("muscle") || msg.contains("gym")) {
//                return combined.contains("chicken") || combined.contains("egg")
//                        || combined.contains("paneer") || combined.contains("protein");
//            }
//            if (msg.contains("weight loss") || msg.contains("low calorie") || msg.contains("diet")) {
//                return combined.contains("salad") || combined.contains("grilled")
//                        || combined.contains("light") || combined.contains("healthy");
//            }
//            if (msg.contains("breakfast")) {
//                return combined.contains("breakfast") || combined.contains("dosa")
//                        || combined.contains("idli") || combined.contains("paratha")
//                        || combined.contains("poha") || combined.contains("upma");
//            }
//            if (msg.contains("lunch")) {
//                return combined.contains("lunch") || combined.contains("thali")
//                        || combined.contains("biryani") || combined.contains("rice")
//                        || combined.contains("dal");
//            }
//            if (msg.contains("dinner")) {
//                return combined.contains("dinner") || combined.contains("biryani")
//                        || combined.contains("roti") || combined.contains("curry")
//                        || combined.contains("naan");
//            }
//            if (msg.contains("kids") || msg.contains("child") || msg.contains("children")) {
//                return combined.contains("pizza") || combined.contains("burger")
//                        || combined.contains("noodle") || combined.contains("pasta")
//                        || combined.contains("sandwich");
//            }
//            if (msg.contains("party") || msg.contains("celebration")) {
//                return combined.contains("biryani") || combined.contains("kebab")
//                        || combined.contains("tikka") || combined.contains("pizza")
//                        || combined.contains("cake");
//            }
//            if (msg.contains("healthy")) {
//                return combined.contains("salad") || combined.contains("grilled")
//                        || combined.contains("fruit") || combined.contains("oats")
//                        || combined.contains("soup");
//            }
//
//            // Category match
//            if (msg.contains("biryani")) return combined.contains("biryani");
//            if (msg.contains("pizza"))   return combined.contains("pizza");
//            if (msg.contains("burger"))  return combined.contains("burger");
//            if (msg.contains("roll"))    return combined.contains("roll");
//            if (msg.contains("salad"))   return combined.contains("salad");
//            if (msg.contains("dosa"))    return combined.contains("dosa");
//            if (msg.contains("noodle"))  return combined.contains("noodle");
//            if (msg.contains("thali"))   return combined.contains("thali");
//
//            return false;
//        }).collect(Collectors.toList());
//    }
//
//    // ─────────────────────────────────────────────
//    // PRIVATE: Build dynamic Ollama prompt
//    // ─────────────────────────────────────────────
//    private String buildPrompt(String userMessage, List<Food> foods) {
//        StringBuilder sb = new StringBuilder();
//
//        sb.append("You are Foodie Bot, an intelligent food ordering assistant for 'Foodies' — ")
//                .append("a popular Indian food delivery app.\n\n")
//                .append("IMPORTANT RULES:\n")
//                .append("- ONLY recommend foods from the list below. Never invent dishes.\n")
//                .append("- Be friendly, warm, and concise (3-4 sentences max).\n")
//                .append("- Use relevant emojis to make it engaging.\n")
//                .append("- Mention food name, price, and why it suits the user's need.\n")
//                .append("- End with: 'Want to explore our full menu? 😊'\n\n")
//                .append("AVAILABLE FOODS ON FOODIES:\n");
//
//        // Add up to 10 foods with full details
//        foods.stream().limit(10).forEach(food -> {
//            sb.append("• ")
//                    .append(food.getName())
//                    .append(" | ₹").append(food.getPrice())
//                    .append(" | ").append(food.isVeg() ? "Veg 🟢" : "Non-Veg 🔴")
//                    .append(" | Category: ").append(nullSafe(food.getFoodCategory()))
//                    .append(" | ").append(nullSafe(food.getDescription()))
//                    .append("\n");
//        });
//
//        sb.append("\nUSER MESSAGE: ").append(userMessage).append("\n\n")
//                .append("Reply as Foodie Bot:");
//
//        return sb.toString();
//    }
//
//    // ─────────────────────────────────────────────
//    // PRIVATE: Call Ollama REST API
//    // ─────────────────────────────────────────────
//    private String callOllama(String prompt) {
//        try {
//            OllamaRequest ollamaRequest = OllamaRequest.builder()
//                    .model(ollamaModel)
//                    .prompt(prompt)
//                    .stream(false)
//                    .build();
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            HttpEntity<OllamaRequest> entity = new HttpEntity<>(ollamaRequest, headers);
//
//            ResponseEntity<OllamaResponse> response = restTemplate.exchange(
//                    ollamaApiUrl,
//                    HttpMethod.POST,
//                    entity,
//                    OllamaResponse.class
//            );
//
//            if (response.getStatusCode() == HttpStatus.OK
//                    && response.getBody() != null
//                    && response.getBody().getResponse() != null) {
//                return response.getBody().getResponse().trim();
//            }
//
//            log.warn("Ollama returned empty or null response body.");
//            return "I'm having trouble thinking right now. Please try again! 🍽️";
//
//        } catch (Exception e) {
//            log.error("Error calling Ollama API: {}", e.getMessage(), e);
//            return "Sorry, the AI assistant is temporarily unavailable. " +
//                    "Please try again in a moment! 🙏";
//        }
//    }
//
//    // ─────────────────────────────────────────────
//    // PRIVATE: Null-safe string helper
//    // ─────────────────────────────────────────────
//    private String nullSafe(String value) {
//        return value != null ? value : "";
//    }
//}
