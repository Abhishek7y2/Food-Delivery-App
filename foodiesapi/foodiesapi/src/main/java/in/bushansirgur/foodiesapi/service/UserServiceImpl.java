package in.bushansirgur.foodiesapi.service;

import in.bushansirgur.foodiesapi.entity.UserEntity;
import in.bushansirgur.foodiesapi.io.UserRequest;
import in.bushansirgur.foodiesapi.io.UserResponse;
import in.bushansirgur.foodiesapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthentificationFacade authentificationFacade;
    private final EmailService emailService;

    @Override
    public UserResponse registerUser(UserRequest request) {

        UserEntity newUser = convertToUserEntity(request);
        
        // Generate 6 digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        newUser.setOtp(otp);
        newUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        newUser.setVerified(false);

        newUser = userRepository.save(newUser);
        
        // Send email asynchronously or synchronously
        emailService.sendOtpEmail(newUser.getEmail(), otp);

        return convertToResponse(newUser);
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        return null;
    }

    @Override
    public String findByUserIdByUserId(String userId) {
        return "";
    }
    
    @Override
    public String findByUserId() {
        String loggedInEmail  = authentificationFacade.getAuthentication().getName();
        UserEntity loggedInUser = userRepository.findByEmail(loggedInEmail).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        return loggedInUser.getId();
    }

    private UserEntity convertToUserEntity(UserRequest userRequest) {

        return UserEntity.builder()
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .name(userRequest.getName())
                .build();
    }

    private UserResponse convertToResponse(UserEntity newUser) {

        return UserResponse.builder()
                .id(newUser.getId())
                .name(newUser.getName())
                .email(newUser.getEmail())
                .build();
    }
}