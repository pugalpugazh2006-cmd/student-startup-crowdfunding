package com.project.crowdfunding.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "pledges")
public class Pledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pitch_id", nullable = false)
    private StartupPitch pitch;

    @NotBlank
    private String backerName;

    @NotBlank
    @Email
    private String backerEmail;

    @NotNull
    private Double amount;

    private LocalDateTime pledgeDate = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public StartupPitch getPitch() { return pitch; }
    public void setPitch(StartupPitch pitch) { this.pitch = pitch; }
    public String getBackerName() { return backerName; }
    public void setBackerName(String backerName) { this.backerName = backerName; }
    public String getBackerEmail() { return backerEmail; }
    public void setBackerEmail(String backerEmail) { this.backerEmail = backerEmail; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public LocalDateTime getPledgeDate() { return pledgeDate; }
    public void setPledgeDate(LocalDateTime pledgeDate) { this.pledgeDate = pledgeDate; }
}
