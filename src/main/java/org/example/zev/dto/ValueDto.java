package org.example.zev.dto;

import java.util.List;

public record ValueDto(List<String> path, String value, String preview) {
}
