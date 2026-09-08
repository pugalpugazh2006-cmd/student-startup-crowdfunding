package com.project.crowdfunding.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaign_milestones")
public class CampaignMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pitch_id", nullable = false)
    private StartupPitch pitch;

    @NotBlank
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime milestoneDate = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public StartupPitch getPitch() { return pitch; }
    public void setPitch(StartupPitch pitch) { this.pitch = pitch; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getMilestoneDate() { return milestoneDate; }
    public void setMilestoneDate(LocalDateTime milestoneDate) { this.milestoneDate = milestoneDate; }
}
