package in.bushansirgur.foodiesapi.io;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthenticationResponse {
    private String name;
    private String email;
    private String profilePictureUrl;
    private String token;
}
