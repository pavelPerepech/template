package org.example.zev.dto;

import java.util.List;

public record DeleteRequestDto(List<String> path, boolean withChildren) {
}
