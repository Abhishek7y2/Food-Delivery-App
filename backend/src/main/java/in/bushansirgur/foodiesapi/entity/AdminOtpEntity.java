package in.bushansirgur.foodiesapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "admin_otps")
public class AdminOtpEntity {

    @Id
    private String id;
    
    private String email;
    private String otp;
    private String name;
    private String password; // We'll store it temporarily (or we can just ask for it again during verification, but usually better to store it temporarily if it's a 2-step process)
    private String profilePictureUrl;
    private LocalDateTime expiryTime;
}
