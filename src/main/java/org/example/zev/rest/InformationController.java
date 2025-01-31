package org.example.zev.rest;

import org.example.zev.dto.AboutDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info")
public class InformationController {

    @GetMapping("/about")
    public AboutDto getAbout() {
        return new AboutDto("Sample");
    }
}
