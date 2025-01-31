package org.example.zev.rest;

import org.example.zev.dto.DeleteRequestDto;
import org.example.zev.dto.NodeInfoDto;
import org.example.zev.dto.ValueDto;
import org.example.zev.dto.ValueUpdateDto;
import org.example.zev.mapper.NodeMapper;
import org.example.zev.service.DataAccessService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/data")
public class DataController {

    private final DataAccessService dataAccessService;

    private final NodeMapper nodeMapper;

    public DataController(DataAccessService dataAccessService, NodeMapper nodeMapper) {
        this.dataAccessService = dataAccessService;
        this.nodeMapper = nodeMapper;
    }


    @PostMapping("/info")
    public List<NodeInfoDto> getRootLevelInfo(@RequestBody List<String> path) throws Exception {
        return dataAccessService.getLevel(path).stream()
                .map(nodeMapper::nodeInfToDto)
                .collect(Collectors.toList());
    }

    @PostMapping("/string-value")
    public ValueDto getValueAsString(@RequestBody List<String> path) throws Exception {
        final var value = dataAccessService.getValueAsString(path);
        return new ValueDto(path, value.value(), value.preview());
    }

    @PutMapping("/string-value")
    public ValueDto updateValueAsString(@RequestBody ValueUpdateDto updateDto) throws Exception {
        final var value = dataAccessService.setValueAsString(updateDto.path(), updateDto.value());
        return new ValueDto(value.path(), value.value(), value.preview());
    }

    @PostMapping
    public List<String> createPath(@RequestBody List<String> path) throws Exception {
        return dataAccessService.createPath(path);
    }

    @DeleteMapping
    public List<String> deletePath(@RequestBody DeleteRequestDto deleteRequest) {
        dataAccessService.deletePath(deleteRequest.path(), deleteRequest.withChildren());
        return deleteRequest.path();
    }
}
