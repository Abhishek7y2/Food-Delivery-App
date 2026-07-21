package in.bushansirgur.foodiesapi.service;

import in.bushansirgur.foodiesapi.entity.UserEntity;
import in.bushansirgur.foodiesapi.repository.UserRepository;
// avoid importing User to prevent name conflicts with project entities
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;




@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AppUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

        // UserEntity currently has no roles/authorities mapping.
        // Provide a default role so JWT-authenticated requests are authorized.
        return org.springframework.security.core.userdetails.User
                .withUsername(email)
                .password(user.getPassword() != null ? user.getPassword() : "")
                .authorities(java.util.Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isVerified()) // Blocks login if not verified
                .build();
    }


}
