package org.example.zev.domain;

import java.util.List;

public record Value(List<String> path, String value, String preview) {
}
