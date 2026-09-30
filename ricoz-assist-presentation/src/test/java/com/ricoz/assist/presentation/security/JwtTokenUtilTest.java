package com.ricoz.assist.presentation.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtTokenUtilTest {

    private JwtTokenUtil jwtTokenUtil;

    @BeforeEach
    void setUp() {
        jwtTokenUtil = new JwtTokenUtil();
        ReflectionTestUtils.setField(jwtTokenUtil, "jwtSecret",
                "test-signing-secret-that-is-long-enough-for-hs512-algorithm-0123456789");
        ReflectionTestUtils.setField(jwtTokenUtil, "jwtExpirationMs", 86400000L);
    }

    @Test
    void generateJwtToken_ShouldReturnToken() {
        UserDetails userDetails = User.builder()
                .username("testuser")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtTokenUtil.generateJwtToken(authentication);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    void generateTokenFromUsername_ShouldReturnToken() {
        String token = jwtTokenUtil.generateTokenFromUsername("testuser");

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    void getUsernameFromToken_ShouldReturnUsername() {
        String token = jwtTokenUtil.generateTokenFromUsername("testuser");

        String username = jwtTokenUtil.getUsernameFromToken(token);

        assertThat(username).isEqualTo("testuser");
    }

    @Test
    void validateJwtToken_ShouldReturnTrue_WhenValidToken() {
        String token = jwtTokenUtil.generateTokenFromUsername("testuser");

        boolean isValid = jwtTokenUtil.validateJwtToken(token);

        assertThat(isValid).isTrue();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenInvalidToken() {
        boolean isValid = jwtTokenUtil.validateJwtToken("invalid.token.here");

        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenEmptyToken() {
        boolean isValid = jwtTokenUtil.validateJwtToken("");

        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenNullToken() {
        boolean isValid = jwtTokenUtil.validateJwtToken(null);

        assertThat(isValid).isFalse();
    }
}
