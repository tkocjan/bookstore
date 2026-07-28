package com.abidimi.bookstore.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface PageMetadataMixin {
    @JsonProperty("currentPage") // Renames "number"
    long getNumber();

    @JsonProperty("pageSize") // Renames "size"
    long getSize();
}
