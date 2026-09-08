package com.project.crowdfunding.repository;

import com.project.crowdfunding.entity.Pledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PledgeRepository extends JpaRepository<Pledge, Long> {
    List<Pledge> findByPitchIdOrderByPledgeDateDesc(Long pitchId);
}
