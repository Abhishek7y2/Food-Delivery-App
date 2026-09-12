package in.bushansirgur.foodiesapi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    private String name;
    
    private String email;
    
    private String password;
    
    private String otp;
    
    private boolean isVerified;
    
    private java.util.Map<String, Integer> cartData = new java.util.HashMap<>();
}
