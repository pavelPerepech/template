package org.example.zev.service;

import org.example.zev.domain.NodeInfo;
import org.example.zev.domain.Value;

import java.util.List;

public interface DataAccessService {

    List<NodeInfo> getLevel(List<String> path) throws Exception;

    Value getValueAsString(List<String> path) throws Exception;

    Value setValueAsString(List<String> path, String value) throws Exception;

    List<String> createPath(List<String> path) throws Exception;

    void deletePath(List<String> path, boolean withChildren);
}
