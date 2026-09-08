package com.project.crowdfunding.controller;

import com.project.crowdfunding.entity.Pledge;
import com.project.crowdfunding.service.PledgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pitches/{pitchId}/pledges")
@CrossOrigin(origins = "*")
public class PledgeController {

    @Autowired
    private PledgeService pledgeService;

    @GetMapping
    public List<Pledge> getPledges(@PathVariable Long pitchId) {
        return pledgeService.getPledgesForPitch(pitchId);
    }

    @PostMapping
    public Pledge createPledge(@PathVariable Long pitchId, @Valid @RequestBody Pledge pledge) {
        return pledgeService.createPledge(pitchId, pledge);
    }
}
