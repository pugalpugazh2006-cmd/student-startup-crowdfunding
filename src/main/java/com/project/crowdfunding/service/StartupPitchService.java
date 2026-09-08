package com.project.crowdfunding.service;

import com.project.crowdfunding.entity.StartupPitch;
import com.project.crowdfunding.repository.StartupPitchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StartupPitchService {

    @Autowired
    private StartupPitchRepository pitchRepository;

    public List<StartupPitch> getAllPitches() {
        return pitchRepository.findAll();
    }

    public Optional<StartupPitch> getPitchById(Long id) {
        return pitchRepository.findById(id);
    }

    public StartupPitch createPitch(StartupPitch pitch) {
        return pitchRepository.save(pitch);
    }

    public StartupPitch updatePitch(StartupPitch pitch) {
        return pitchRepository.save(pitch);
    }
}
