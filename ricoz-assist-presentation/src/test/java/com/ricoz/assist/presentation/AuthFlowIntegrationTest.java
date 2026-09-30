package com.ricoz.assist.presentation;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.jayway.jsonpath.JsonPath;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void registersAndAuthenticatesUserThenCreatesProtectedResources() throws Exception {
        MvcResult registration = mockMvc.perform(post("/api/v1/auth/register")
                        .contextPath("/api/v1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "test-user",
                                  "email": "test-user@example.com",
                                  "password": "Str0ng!Passw0rd",
                                  "firstName": "Test",
                                  "lastName": "User"
                                }
                                """))
                .andExpect(status().isCreated())
                .andReturn();

        String userId = JsonPath.read(registration.getResponse().getContentAsString(), "$.id");

        MvcResult login = mockMvc.perform(post("/api/v1/auth/login")
                        .contextPath("/api/v1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "test-user",
                                  "password": "Str0ng!Passw0rd"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andReturn();

        String token = JsonPath.read(login.getResponse().getContentAsString(), "$.token");

        mockMvc.perform(post("/api/v1/documents")
                        .contextPath("/api/v1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Integration test document",
                                  "content": "Test content",
                                  "status": "DRAFT",
                                  "documentType": "REPORT",
                                  "ownerId": "%s"
                                }
                                """.formatted(userId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ownerId").value(userId));

        mockMvc.perform(post("/api/v1/queries")
                        .contextPath("/api/v1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "queryText": "Test query",
                                  "queryType": "GENERAL_QA"
                                }
                                """))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.createdByUserId").value(userId));
    }

    @Test
    void rejectsRequestsToProtectedResourcesWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/v1/documents/00000000-0000-0000-0000-000000000001")
                        .contextPath("/api/v1"))
                .andExpect(status().isForbidden());
    }
}
