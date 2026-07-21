package in.bushansirgur.foodiesapi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(toEmail);
            helper.setSubject("Your Foodies Verification Code");
            
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; text-align: center;'>"
                    + "<h2 style='color: #ff6347;'>Foodies Registration</h2>"
                    + "<p>Thank you for signing up! Please use the following OTP to verify your email address. This code will expire in 5 minutes.</p>"
                    + "<h1 style='letter-spacing: 5px; background: #f4f4f4; padding: 15px; border-radius: 8px; display: inline-block;'>" + otp + "</h1>"
                    + "</div>";
                    
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            System.out.println("OTP email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            System.out.println("=================================================");
            System.out.println("FALLBACK: Your OTP for " + toEmail + " is: " + otp);
            System.out.println("=================================================");
            // We intentionally do not throw an exception here, so the user can still register
            // and read the OTP from the backend console if they haven't set up an App Password!
        }
    }
}
