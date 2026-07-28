package com.abidimi.bookstore.config;

//import com.abidimi.bookstore.rest.dto.PageMetadataMixin;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.web.PagedModel;
//import tools.jackson.databind.json.JsonMapper;
//
//@Configuration
//public class JacksonConfig {
//
//    public JacksonConfig(JsonMapper jsonMapper) {
////        // Apply the previous mix-in to rename outer fields like "content" -> "items"
////        jsonMapper.addMixIn(PagedModel.class, PagedModelMixin.class);
//
//        // Apply this new mix-in to rename internal fields like "totalElements" -> "total_items"
//        jsonMapper.addMixIn(PagedModel.PageMetadata.class, PageMetadataMixin.class);
//
//        jsonMapper.builder()
//                .addMixIn(PagedModel.PageMetadata.class, PageMetadataMixin.class)
//                .build();
//
//
//    }
//}

import com.abidimi.bookstore.rest.dto.PageMetadataMixin;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.PagedModel;

@Configuration
public class JacksonConfig {

    public JacksonConfig(ObjectMapper objectMapper) {
//        // Apply the previous mix-in to rename outer fields like "content" -> "items"
//        objectMapper.addMixIn(PagedModel.class, PagedModelMixin.class);

        // Apply this new mix-in to rename internal fields like "totalElements" -> "total_items"
        objectMapper.addMixIn(PagedModel.PageMetadata.class, PageMetadataMixin.class);
    }
}

//import com.abidimi.bookstore.rest.dto.PageMetadataMixin;
//import io.swagger.v3.core.util.Json;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.web.PagedModel;
//import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import tools.jackson.databind.json.JsonMapper;
//
//@Configuration
//@RequiredArgsConstructor
//@SuppressWarnings("removal")
//public class JacksonConfig {
//    private final Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder;
//
//    @Bean
//    public ObjectMapper objectMapper() {
//        ObjectMapper objectMapper = jackson2ObjectMapperBuilder.build();
//
//        objectMapper.addMixIn(PagedModel.PageMetadata.class, PageMetadataMixin.class);
//        return objectMapper;
//    }
//}
