package com.rentify.security;



import com.rentify.entity.User;
import com.rentify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Use transactional read-only

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Locates the user based on the username. In the actual implementation, the search
     * may possibly be case insensitive, or the user may be found using other unique identifiers
     * like email depending on the login strategy.
     *
     * @param username the username identifying the user whose data is required.
     * @return a fully populated user record (never {@code null})
     * @throws UsernameNotFoundException if the user could not be found or the user has no
     * GrantedAuthority
     */
    @Override
    @Transactional(readOnly = true) // Important for fetching lazy-loaded collections like roles
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Attempting to load user by username: {}", username);
        // User entity implements UserDetails, so we can return it directly
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("User not found with username: {}", username);
                    return new UsernameNotFoundException("User not found with username: " + username);
                });
        log.info("User found: {}. Loading authorities...", username);
        // Eager fetch ensures roles are loaded within the transaction
        // (if roles were LAZY, you'd need user.getRoles().size() or similar to trigger loading)
        log.debug("Authorities loaded for user {}: {}", username, user.getAuthorities());
        return user;
    }
}