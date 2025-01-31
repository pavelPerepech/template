package org.example.zev.service.impl;

import org.apache.curator.framework.CuratorFramework;
import org.apache.zookeeper.Op;
import org.example.zev.domain.NodeInfo;
import org.example.zev.domain.Value;
import org.example.zev.service.DataAccessService;
import org.example.zev.util.BusinessException;
import org.example.zev.util.InternalError;
import org.springframework.stereotype.Service;

import javax.annotation.Nullable;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.text.MessageFormat.format;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
public class DataAccessServiceImpl implements DataAccessService {

    private final CuratorFramework zoo;

    public DataAccessServiceImpl(CuratorFramework zoo) {
        this.zoo = zoo;
    }

    @Override
    public List<NodeInfo> getLevel(final List<String> path) throws Exception {
        final String zooPath = getZooPath(path);

        final List<String> childrenNames = zoo
                .getChildren()
                .forPath(zooPath);

        childrenNames.sort(String::compareTo);

        return childrenNames.stream()
                .map(node -> {
                    final var nodePath = concatPath(zooPath, node);
                    try {
                        return new NodeInfo(node, hasChildren(nodePath), getPreview(nodePath));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deletePath(List<String> path, boolean withChildren) {
        if (isNull(path) || path.isEmpty()) {
            throw new BusinessException("Path must be specified");
        }
        final String zooPath = getZooPath(path);
        try {
            final boolean exists = nonNull(zoo.checkExists().forPath(zooPath));
            if (!exists) {
                return;
            }
        } catch (Exception e) {
            throw new InternalError(e.getMessage(), e);
        }

        if (!withChildren) {
            try {
                final boolean hasChildren = hasChildren(zooPath);
                if (hasChildren) {
                    throw new BusinessException(format("Node {0} has children nodes", zooPath));
                }
            } catch (Exception e) {
                throw new InternalError(e.getMessage(), e);
            }
        }

        try {
            zoo.delete().deletingChildrenIfNeeded().forPath(zooPath);
        } catch (Exception e) {
            throw new InternalError(format("Error delete node {0} caused by: {1}", zooPath, e.getMessage()), e);
        }
    }

    private boolean hasChildren(final String path) throws Exception {
        return !zoo.getChildren()
                .forPath(path)
                .isEmpty();
    }

    private String getPreview(final String path) throws Exception {
        final byte[] value = zoo
                .getData()
                .forPath(path);

        return getPreviewFromBytes(value);
    }

    private String getPreviewFromBytes(@Nullable byte[] src) {
        if (isNull(src)) {
            return "-- empty --";
        }

        String asString;
        try {
            asString = new String(src, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return format("{0} bytes", src.length);
        }

        return getPreviewFromString(asString);
    }

    private String getPreviewFromString(@Nullable final String src) {
        if (isNull(src)) {
            return null;
        }

        String asString = src;
        final int crlfIdx = asString.indexOf("\n");
        boolean ripped = false;
        if (crlfIdx >= 0 && crlfIdx <= 40) {
            asString = asString.substring(0, crlfIdx);
            ripped = true;
        }

        if (asString.length() > 40) {
            asString = asString.substring(0, 40);
            ripped = true;
        }

        return ripped ? asString + "...": asString;
    }

    @Override
    public Value getValueAsString(List<String> path) throws Exception {
        final String zooPath = getZooPath(path);
        final byte[] data = zoo.getData().forPath(zooPath);

        final var readValue = Optional.ofNullable(data)
                .map(byteData -> new String(byteData, StandardCharsets.UTF_8))
                .orElse(null);

        return Optional.ofNullable(readValue)
                .map(present -> new Value(path, present, getPreviewFromBytes(data)))
                .orElseGet(() -> new Value(path, null, getPreviewFromBytes(data)));
    }

    @Override
    public Value setValueAsString(List<String> path, String value) throws Exception {
        final String zooPath = getZooPath(path);

        final boolean isExists = nonNull(zoo.checkExists().forPath(zooPath));
        if (!isExists) {
            throw new BusinessException(format("Value {0} is not exists", zooPath));
        }

        zoo.setData().forPath(zooPath, Optional.ofNullable(value)
                .map(it -> it.getBytes(StandardCharsets.UTF_8))
                .orElseGet(() -> new byte[0]));

        return new Value(path, value, getPreviewFromString(value));
    }

    @Override
    public List<String> createPath(List<String> path) throws Exception {
        final String zooPath = getZooPath(path);
        final boolean isExists = Objects.nonNull(zoo.checkExists().forPath(zooPath));

        if (isExists) {
            return path;
        }

        final String result = zoo.create().creatingParentsIfNeeded().forPath(zooPath, new byte[0]);
        return path;
    }

    private String concatPath(final String p1, final String p2) {
        final var path1 = Optional.ofNullable(p1).orElse("/");
        final var path2 = Optional.ofNullable(p2).orElse("/");

        final StringBuilder result = new StringBuilder(path1);
        final boolean endSlash = path1.endsWith("/");
        final boolean startSlash = path2.startsWith("/");

        if (!endSlash && !startSlash) {
            result.append('/');
        }

        if (endSlash && startSlash) {
            if (path2.length() > 1) {
                result.append(path2.substring(1));
            }
        } else {
            result.append(path2);
        }

        return result.toString();
    }

    private String getZooPath(final List<String> path) {
        final var pb = new StringBuilder(Objects.requireNonNull(path, "").stream()
                .collect(Collectors.joining("/")));
        if (pb.isEmpty() || !pb.substring(0, 1).equals("/")) {
            pb.insert(0, '/');
        }
        return pb.toString();
    }
}
