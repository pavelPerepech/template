package org.example.zev.dto;

import java.util.List;

public record ValueUpdateDto(List<String> path, String value) {
}
