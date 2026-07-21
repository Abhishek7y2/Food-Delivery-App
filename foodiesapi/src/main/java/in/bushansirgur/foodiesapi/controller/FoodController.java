
package in.bushansirgur.foodiesapi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.bushansirgur.foodiesapi.io.FoodRequest;
import in.bushansirgur.foodiesapi.io.FoodResponse;
import in.bushansirgur.foodiesapi.service.FoodService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
//import software.amazon.awssdk.thirdparty.jackson.core.JsonProcessingException;
//import tools.jackson.databind.ObjectMapper;

@AllArgsConstructor
@RestController
@RequestMapping("/api/foods")
// @CrossOrigin("*")
/// @CrossOrigin(origins = "http://localhost:5174")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class FoodController {

    // private FoodRequest request;
    private FoodService foodService;

    @PostMapping
    public FoodResponse addFood(@RequestPart("food") String foodString,
            @RequestPart("file") MultipartFile file) throws ResponseStatusException {
        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest foodRequest = null;
        // request = objectMapper.readValue(foodString, FoodRequest.class);
        try {
            // request = objectMapper.readValue(foodString, FoodRequest.class);
            foodRequest = objectMapper.readValue(foodString, FoodRequest.class); // FIX: was 'FoodRequest request = ...'
                                                                                 // creating a new local variable that
                                                                                 // dies in try block — changed to
                                                                                 // assign to 'foodRequest' declared
                                                                                 // above
        } catch (JsonProcessingException ex) {
            // return ResponseEntity.badRequest().build();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Json formate");
        }
        // FoodResponse response = foodService.addFood(foodRequest,file);
        FoodResponse response = foodService.addFood(foodRequest, file);
        return response;
    }

    @GetMapping
    public List<FoodResponse> readFoods() {
        return foodService.readFoods();
    }

    @GetMapping("/{id}")
    public FoodResponse readFood(@PathVariable String id) {
        return foodService.readFood(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(@PathVariable String id) {
        foodService.deleteFood(id);
    }

    @PutMapping("/{id}")
    public FoodResponse updateFood(@PathVariable String id, @RequestBody FoodRequest request) {
        return foodService.updateFood(id, request);
    }

}
