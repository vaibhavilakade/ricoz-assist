package com.ricoz.assist.presentation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ricoz.assist.application.service.UserService;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.presentation.dto.LoginRequest;
import com.ricoz.assist.presentation.dto.LoginResponse;
import com.ricoz.assist.presentation.dto.RegisterRequest;
import com.ricoz.assist.presentation.dto.UserDTO;
import com.ricoz.assist.presentation.dto.mapper.UserMapper;
import com.ricoz.assist.presentation.exception.GlobalExceptionHandler;
import com.ricoz.assist.presentation.security.JwtTokenUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.context.annotation.Import;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ContextConfiguration(classes = AuthControllerTest.WebTestApplication.class)
@Import({AuthController.class, GlobalExceptionHandler.class})
class AuthControllerTest {

    @SpringBootConfiguration
    static class WebTestApplication {
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @MockBean
    private UserMapper userMapper;

    @MockBean
    private UserDetailsService userDetailsService;

    private LoginRequest loginRequest;
    private RegisterRequest registerRequest;
    private User testUser;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        loginRequest = LoginRequest.builder()
                .username("testuser")
                .password("password123")
                .build();

        registerRequest = RegisterRequest.builder()
                .username("newuser")
                .email("new@example.com")
                .password("Password123!")
                .firstName("New")
                .lastName("User")
                .build();

        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash("encodedPassword")
                .role(User.UserRole.USER)
                .active(true)
                .build();

        userDTO = UserDTO.builder()
                .username("testuser")
                .email("test@example.com")
                .role(User.UserRole.USER)
                .active(true)
                .build();
    }

    @Test
    void login_ShouldReturnToken_WhenValidCredentials() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "testuser", null, java.util.Collections.emptyList());
        
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtTokenUtil.generateJwtToken(any())).thenReturn("jwt-token");
        when(userService.getUserByUsername("testuser")).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(userDTO);
        when(jwtTokenUtil.getExpirationTime()).thenReturn(86400000L);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andExpect(jsonPath("$.user.username").value("testuser"));
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenInvalidCredentials() throws Exception {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void register_ShouldReturnUser_WhenValidData() throws Exception {
        when(userService.createUser(any(User.class))).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(userDTO);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void register_ShouldReturnBadRequest_WhenInvalidData() throws Exception {
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .username("ab")
                .email("invalid-email")
                .password("123")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void logout_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(post("/auth/logout"))
                .andExpect(status().isNoContent());
    }
}
