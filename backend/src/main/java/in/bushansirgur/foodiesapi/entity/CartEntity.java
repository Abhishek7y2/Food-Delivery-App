package in.bushansirgur.foodiesapi.entity;
//package in.bushansirgur.foodiesapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "carts")
public class CartEntity {

    @Id
    private String id;

    private String userId;

    private Map<String, Integer> items = new HashMap<>();

    public CartEntity(String userId, Map<String, Integer> items) {
        this.userId = userId;
        this.items = items;
    }
}









//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.function.Supplier;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//@Document(collection = "carts")
//public class CartEntity implements SupplierX> {
//
//    @Id
//    private String id;
//
//    private String userId;
//
//    private Map<String, Integer> items = new HashMap<>();
//
//    public CartEntity(String userId, Map<String, Integer> items) {
//        this.userId = userId;
//        this.items = items;
//    }
//}



//package in.bushansirgur.foodiesapi.entity;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.function.Supplier;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//@Document(collection = "carts")
//public class CartEntity implements Supplier<X> {
//
//    @Id
//    private String id;
//
//    private String userId;
//
//    private Map<String, Integer> items = new HashMap<>();
//
//    public CartEntity(String userId, Map<String, Integer> items) {
//        this.userId = userId;
//        this.items = items;
//    }
//
//    @Override
//    public X get() {
//        return null;
//    }
//
////    public CartEntity(String userId, Map<String, Integer> items) {
////        this.userId = userId;
////        this.items = items;
////    }
//}
//
//
//
//
//
//
//package in.bushansirgur.foodiesapi.entity;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.springframework.data.annotation.Id;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//@Document(collection = "carts")
//public class CartEntity {
//
//    private String id;
//    private String userId;
//    private Map<String, Integer> items = new HashMap<>();
//
//    public CartEntity(String userId, Map<String, Integer> items) {
//        this.userId = userId;
//        this.items = items;
//    }
//}
