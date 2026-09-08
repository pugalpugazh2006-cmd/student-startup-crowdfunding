package com.project.crowdfunding.service;

import com.project.crowdfunding.entity.Pledge;
import com.project.crowdfunding.entity.StartupPitch;
import com.project.crowdfunding.repository.PledgeRepository;
import com.project.crowdfunding.repository.StartupPitchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PledgeService {

    @Autowired
    private PledgeRepository pledgeRepository;

    @Autowired
    private StartupPitchRepository pitchRepository;

    public List<Pledge> getPledgesForPitch(Long pitchId) {
        return pledgeRepository.findByPitchIdOrderByPledgeDateDesc(pitchId);
    }

    @Transactional
    public Pledge createPledge(Long pitchId, Pledge pledge) {
        StartupPitch pitch = pitchRepository.findById(pitchId)
                .orElseThrow(() -> new RuntimeException("Pitch not found"));
        
        pledge.setPitch(pitch);
        Pledge savedPledge = pledgeRepository.save(pledge);

        // Update current amount in pitch
        pitch.setCurrentAmount(pitch.getCurrentAmount() + pledge.getAmount());
        
        // Check if goal met
        if (pitch.getCurrentAmount() >= pitch.getTargetAmount() && !pitch.getStatus().equals("COMPLETED")) {
            pitch.setStatus("COMPLETED");
        }
        
        pitchRepository.save(pitch);
        
        return savedPledge;
    }
}
