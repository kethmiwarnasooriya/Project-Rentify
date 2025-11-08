package com.rentify.config;

import com.rentify.security.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService; // Assuming it's used if @EnableMethodSecurity is active

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null); // Let frontend read from cookie

        http
                // Apply CORS config using the Bean defined below. This often needs to be early.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // CSRF Configuration
                .csrf(csrf -> csrf
                                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // Allow JS read cookie
                                .csrfTokenRequestHandler(requestHandler)
                        // If CSRF continues failing ONLY on register/login, you MIGHT temporarily ignore them,
                        // BUT THIS IS LESS SECURE FOR LOGIN and generally not recommended for register either.
                        .ignoringRequestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/register-admin")
                )
                .exceptionHandling(customizer -> customizer
                        .authenticationEntryPoint(new HttpStatusEntryPoint(UNAUTHORIZED)) // Return 401 on auth required
                        .accessDeniedHandler((request, response, accessDeniedException) -> response.setStatus(HttpServletResponse.SC_FORBIDDEN)) // Return 403 on denied
                )
                .authorizeHttpRequests(auth -> auth
                        // Allow CORS preflight OPTIONS requests globally BEFORE other rules
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Publicly accessible paths
                        .requestMatchers("/", "/index.html", "/static/**", "/error").permitAll()
                        .requestMatchers("/api/auth/**").permitAll() // Allow register, login, status
                        .requestMatchers(HttpMethod.GET, "/api/properties/**", "/api/files/**").permitAll() // Allow reading properties/files
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger
                        // Owner role restrictions (redundant if using @PreAuthorize, but safe)
                        .requestMatchers(HttpMethod.POST, "/api/properties", "/api/files/upload").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PUT, "/api/properties/**").hasRole("OWNER")
                        .requestMatchers(HttpMethod.DELETE, "/api/properties/**").hasRole("OWNER")
                        .requestMatchers("/api/properties/my-properties").hasRole("OWNER")
                        // Admin role restrictions
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // All other requests must be authenticated
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .maximumSessions(1).expiredUrl("/login?session-expired=true") // Prevent concurrent login
                )
                .formLogin(AbstractHttpConfigurer::disable) // Disable default login page
                .logout(logout -> logout // Configure API logout
                        .logoutUrl("/api/auth/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID", "XSRF-TOKEN")
                        .logoutSuccessHandler((request, response, auth) -> response.setStatus(HttpServletResponse.SC_OK))
                );

        return http.build();
    }

    // CORS Configuration Bean
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // **IMPORTANT**: List your EXACT frontend origin(s)
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001")); // Allow both 3000 and 3001 if you switch
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", "Cache-Control", "Content-Type", "X-XSRF-TOKEN", // Crucial for CSRF
                "X-Requested-With", "Accept", "Origin",
                "Access-Control-Request-Method", "Access-Control-Request-Headers"
                // Add any other custom headers your frontend might send
        ));
        // configuration.setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")); // Usually not needed if allowCredentials is true
        configuration.setAllowCredentials(true); // REQUIRED for cookies/session/CSRF cookie reading
        configuration.setMaxAge(3600L); // 1 hour cache for preflight response

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply this config to all paths
        return source;
    }
}