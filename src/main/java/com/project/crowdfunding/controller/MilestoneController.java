package com.project.crowdfunding.controller;

import com.project.crowdfunding.entity.CampaignMilestone;
import com.project.crowdfunding.service.CampaignMilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pitches/{pitchId}/milestones")
@CrossOrigin(origins = "*")
public class MilestoneController {

    @Autowired
    private CampaignMilestoneService milestoneService;

    @GetMapping
    public List<CampaignMilestone> getMilestones(@PathVariable Long pitchId) {
        return milestoneService.getMilestonesForPitch(pitchId);
    }

    @PostMapping
    public CampaignMilestone createMilestone(@PathVariable Long pitchId, @Valid @RequestBody CampaignMilestone milestone) {
        return milestoneService.createMilestone(pitchId, milestone);
    }
}
