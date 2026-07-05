package in.bushansirgur.foodiesapi.config;

import in.bushansirgur.foodiesapi.filters.JwtAuthenticationFilter;
import in.bushansirgur.foodiesapi.service.AppUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AppUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(AppUserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/register",
                                "/api/login",
                                "/api/foods/**",
                                "/api/orders/create",
                                "/api/orders/verify",
                                "/api/orders/all",
                                "/api/orders/status/**",
                                "/api/ai/**"
                        )
                        .permitAll()
                        .anyRequest()
                        .authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "https://smart-food-delivery-app.vercel.app"
        ));
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authProvider);
    }
}








// package in.bushansirgur.foodiesapi.config;

// import in.bushansirgur.foodiesapi.security.JwtAuthenticationFilter;
// import in.bushansirgur.foodiesapi.service.AppUserDetailsService;
// //import in.bushansirgur.foodiesapi.filterSJwtAuthenticationFilter;
// //import in.bushansirgur.foodiesapi.service.AppUserDetailsService;
// //import in.bushansirgur.foodiesapi.filters.JwtAuthenticationFilter;
// import lombok.AllArgsConstructor;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.ProviderManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
// import org.springframework.web.filter.CorsFilter;

// import java.util.Arrays;
// import java.util.List;

// @Configuration
// @EnableWebSecurity
// @AllArgsConstructor
// public class SecurityConfig {


//    private final AppUserDetailsService userDetailsService;
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
// //    private final CorsConfigurationSource corsConfigurationSource;
// //
// //    public SecurityConfig(CorsConfigurationSource corsConfigurationSource) {
// //        this.corsConfigurationSource = corsConfigurationSource;
// //    }

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .cors(Customizer.withDefaults())
//                .csrf(AbstractHttpConfigurer::disable)
// //                .authorizeHttpRequests(auth -> auth.requestMatchers("/api/register","/api/login","/api/foods/**")
// //                        .permitAll().anyRequest().authenticated())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/api/register",
//                                "/api/login",
//                                "/api/foods/**",
//                                "/api/orders/create",
//                                "/api/orders/verify",
//                                "/api/orders/all",
//                                "/api/orders/status/**",
//                                "/api/ai/**"
//                        )
//                        .permitAll()
//                        .anyRequest()
//                        .authenticated()
//                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//        return http.build();

//    }
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//       return new BCryptPasswordEncoder();
//    }
//    @Bean
//    public CorsFilter corsFilter(){
//        return new CorsFilter(corsConfigurationSource());
//    }

//    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config= new CorsConfiguration();
// //        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
//        config.setAllowedOrigins(
//                List.of(
//                        "https://smart-food-delivery-app.vercel.app/login",
//                        "https://smart-food-delivery-app.vercel.app/register",
//                        "http://localhost:5173",
//                        "http://localhost:5174",
//                        "http://localhost:5175",
//                        "http://localhost:5176"
//                )
//        );
//        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
//        config.setAllowedHeaders(List.of("Authorization","Content-Type"));
//        config.setAllowCredentials(true);
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }
//    @Bean
//    public AuthenticationManager authenticationManager() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(userDetailsService);
//        authProvider.setPasswordEncoder(passwordEncoder());
//        return new ProviderManager(authProvider);
//    }


// }
