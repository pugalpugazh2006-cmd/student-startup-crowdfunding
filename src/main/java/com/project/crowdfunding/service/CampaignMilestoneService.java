package com.project.crowdfunding.service;

import com.project.crowdfunding.entity.CampaignMilestone;
import com.project.crowdfunding.entity.StartupPitch;
import com.project.crowdfunding.repository.CampaignMilestoneRepository;
import com.project.crowdfunding.repository.StartupPitchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CampaignMilestoneService {

    @Autowired
    private CampaignMilestoneRepository milestoneRepository;

    @Autowired
    private StartupPitchRepository pitchRepository;

    public List<CampaignMilestone> getMilestonesForPitch(Long pitchId) {
        return milestoneRepository.findByPitchIdOrderByMilestoneDateDesc(pitchId);
    }

    public CampaignMilestone createMilestone(Long pitchId, CampaignMilestone milestone) {
        StartupPitch pitch = pitchRepository.findById(pitchId)
                .orElseThrow(() -> new RuntimeException("Pitch not found"));
        milestone.setPitch(pitch);
        return milestoneRepository.save(milestone);
    }
}
