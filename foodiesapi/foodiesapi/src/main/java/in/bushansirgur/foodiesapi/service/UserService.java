package in.bushansirgur.foodiesapi.service;

import in.bushansirgur.foodiesapi.io.UserRequest;
import in.bushansirgur.foodiesapi.io.UserResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    UserDetails loadUserByUsername(String email);

    String findByUserIdByUserId(String userId);

    String findByUserId();

//    String findByUserId();
}
