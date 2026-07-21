package in.bushansirgur.foodiesapi.controller;

import in.bushansirgur.foodiesapi.Util.JwtUtil;
import in.bushansirgur.foodiesapi.entity.UserEntity;
import in.bushansirgur.foodiesapi.io.AuthenticationRequest;
import in.bushansirgur.foodiesapi.io.AuthenticationResponse;
import in.bushansirgur.foodiesapi.repository.UserRepository;
import in.bushansirgur.foodiesapi.service.AppUserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5174")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final in.bushansirgur.foodiesapi.service.EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            UserEntity userEntity = userRepository.findFirstByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String otp = String.format("%06d", new java.util.Random().nextInt(999999));
            userEntity.setOtp(otp);
            userEntity.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
            userRepository.save(userEntity);

            String emailText = "Welcome back to Foodies!\n\nYour OTP for login is: " + otp
                    + "\n\nThis OTP is valid for 10 minutes.";
            emailService.sendSimpleEmail(userEntity.getEmail(), "Foodies - Login OTP", emailText);

            return ResponseEntity.ok(java.util.Map.of("message", "OTP sent to email", "requiresOtp", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");

            UserEntity userEntity = userRepository.findFirstByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (userEntity.getOtp() == null || !userEntity.getOtp().equals(otp)) {
                return ResponseEntity.status(401).body(java.util.Map.of("message", "Invalid OTP"));
            }

            if (userEntity.getOtpExpiry() != null
                    && userEntity.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
                return ResponseEntity.status(401).body(java.util.Map.of("message", "OTP expired"));
            }

            // OTP is valid
            userEntity.setOtp(null);
            userEntity.setOtpExpiry(null);
            userRepository.save(userEntity);

            final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            final String jwtToken = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthenticationResponse(userEntity.getName(), email,
                    userEntity.getProfilePictureUrl(), jwtToken));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request.get("email");
            UserEntity userEntity = userRepository.findFirstByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String otp = String.format("%06d", new java.util.Random().nextInt(999999));
            userEntity.setOtp(otp);
            userEntity.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
            userRepository.save(userEntity);

            String emailText = "Welcome back to Foodies!\n\nYour new OTP is: " + otp
                    + "\n\nThis OTP is valid for 10 minutes.";
            emailService.sendSimpleEmail(userEntity.getEmail(), "Foodies - New OTP", emailText);

            return ResponseEntity.ok(java.util.Map.of("message", "A new OTP has been sent to your email."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/test-hash")
    public ResponseEntity<?> testHash(@RequestBody AuthenticationRequest request) {
        UserEntity userEntity = userRepository.findFirstByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        org.springframework.security.crypto.password.PasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        boolean matches = encoder.matches(request.getPassword(), userEntity.getPassword());
        return ResponseEntity.ok("Password matches hash? " + matches);
    }
}
