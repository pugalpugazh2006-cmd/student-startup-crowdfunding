package com.project.crowdfunding.repository;

import com.project.crowdfunding.entity.CampaignMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CampaignMilestoneRepository extends JpaRepository<CampaignMilestone, Long> {
    List<CampaignMilestone> findByPitchIdOrderByMilestoneDateDesc(Long pitchId);
}
