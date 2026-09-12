package in.bushansirgur.foodiesapi.controller;

import in.bushansirgur.foodiesapi.entity.AdminOtpEntity;
import in.bushansirgur.foodiesapi.entity.UserEntity;
import in.bushansirgur.foodiesapi.repository.AdminOtpRepository;
import in.bushansirgur.foodiesapi.repository.UserRepository;
import in.bushansirgur.foodiesapi.service.EmailService;
import in.bushansirgur.foodiesapi.service.FoodService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5174")
public class AdminAuthController {

    @Autowired
    private AdminOtpRepository adminOtpRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private FoodService foodService;
    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @RequestPart("name") String name,
            @RequestPart("email") String email,
            @RequestPart("password") String password,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        System.out.println("SIGNUP: Received password: [" + password + "], length: " + password.length());

        if (userRepository.findFirstByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }

        String profilePictureUrl = null;
        if (file != null && !file.isEmpty()) {
            profilePictureUrl = foodService.uploadFile(file);
        }

        // Generate 6 digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Delete existing OTP if any
        adminOtpRepository.deleteByEmail(email);

        // Save OTP to DB
        AdminOtpEntity otpEntity = AdminOtpEntity.builder()
                .email(email)
                .name(name)
                .password(passwordEncoder.encode(password))
                .profilePictureUrl(profilePictureUrl)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();
        adminOtpRepository.save(otpEntity);

        // Send OTP via SMTP
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(email);
            mailMessage.setSubject("Your Admin Panel OTP Code");
            mailMessage.setText("Hello " + name + ",\n\nYour OTP code for signing up is: " + otp
                    + "\n\nThis code will expire in 10 minutes.\n\nThank you!");
            mailSender.send(mailMessage);
        } catch (Exception mailEx) {
            System.out.println("Dev Mode Notice: SMTP skipped (" + mailEx.getMessage() + "). Signup OTP for " + email + " is: " + otp);
        }

        return ResponseEntity.ok("OTP sent to your email. (Dev Mode OTP: " + otp + ")");
    }

    @PostMapping("/verify-signup")
    public ResponseEntity<?> verifySignup(@RequestBody VerifyRequest request) {
        Optional<AdminOtpEntity> otpOpt = adminOtpRepository.findFirstByEmail(request.getEmail());

        if (otpOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No pending OTP found for this email.");
        }

        AdminOtpEntity otpEntity = otpOpt.get();

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            adminOtpRepository.delete(otpEntity);
            return ResponseEntity.badRequest().body("OTP has expired. Please request a new one.");
        }

        if (!otpEntity.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid OTP.");
        }

        // Create Admin User
        UserEntity newUser = UserEntity.builder()
                .email(otpEntity.getEmail())
                .name(otpEntity.getName())
                .password(otpEntity.getPassword()) // already hashed during send-otp
                .profilePictureUrl(otpEntity.getProfilePictureUrl())
                .build();

        userRepository.save(newUser);
        adminOtpRepository.delete(otpEntity); // Clean up OTP

        return ResponseEntity.ok("Admin account verified and created successfully.");
    }
}

@Data
class VerifyRequest {
    private String email;
    private String otp;
}
