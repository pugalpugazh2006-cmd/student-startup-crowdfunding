package com.project.crowdfunding.repository;

import com.project.crowdfunding.entity.StartupPitch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StartupPitchRepository extends JpaRepository<StartupPitch, Long> {
}
