//package in.bushansirgur.foodiesapi.io;
//
//public class AIResponse {
//}
//
//package in.bushansirgur.foodiesapi.io;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
////
////import java.util.List;
////
////@Data
////@AllArgsConstructor
////@NoArgsConstructor
////@Builder
////public class AIResponse {
////
////    private String reply;
////
////    private List<String> recommendedFoods;
////
////    private String action;
////
////    private String foodId;
////
////}
//
//package in.bushansirgur.foodiesapi.io;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.util.List;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//public class AIResponse {
//    private String reply;
//    private List<String> recommendedFoods;
//    private String action;
//    private String foodId;
//}

package in.bushansirgur.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AIResponse {
    private String reply;
    private List<String> recommendedFoods;
    private String action;
    private String foodId;
}