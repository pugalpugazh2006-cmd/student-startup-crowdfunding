package com.project.crowdfunding.controller;

import com.project.crowdfunding.entity.StartupPitch;
import com.project.crowdfunding.service.StartupPitchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pitches")
@CrossOrigin(origins = "*")
public class PitchController {

    @Autowired
    private StartupPitchService pitchService;

    @GetMapping
    public List<StartupPitch> getAllPitches() {
        return pitchService.getAllPitches();
    }

    @PostMapping
    public StartupPitch createPitch(@Valid @RequestBody StartupPitch pitch) {
        return pitchService.createPitch(pitch);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StartupPitch> getPitchById(@PathVariable Long id) {
        return pitchService.getPitchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
