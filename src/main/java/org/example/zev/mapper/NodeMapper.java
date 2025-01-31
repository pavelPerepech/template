package org.example.zev.mapper;

import org.example.zev.domain.NodeInfo;
import org.example.zev.dto.NodeInfoDto;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface NodeMapper {

    NodeInfoDto nodeInfToDto(NodeInfo src);
}
