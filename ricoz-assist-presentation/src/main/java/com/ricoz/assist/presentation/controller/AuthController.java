package com.ricoz.assist.presentation.controller;

import com.ricoz.assist.application.service.UserService;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.presentation.dto.LoginRequest;
import com.ricoz.assist.presentation.dto.LoginResponse;
import com.ricoz.assist.presentation.dto.RegisterRequest;
import com.ricoz.assist.presentation.dto.UserDTO;
import com.ricoz.assist.presentation.dto.mapper.UserMapper;
import com.ricoz.assist.presentation.security.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs for user authentication and authorization")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserMapper userMapper;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT token")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenUtil.generateJwtToken(authentication);

        User user = userService.getUserByUsername(loginRequest.getUsername());
        UserDTO userDTO = userMapper.toDTO(user);

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .expiresIn(jwtTokenUtil.getExpirationTime())
                .user(userDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .passwordHash(registerRequest.getPassword())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .role(User.UserRole.USER)
                .build();

        User created = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDTO(created));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user (client-side token removal)")
    public ResponseEntity<Void> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }
}
