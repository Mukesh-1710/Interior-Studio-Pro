package com.interior.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quotation Details
    private String quotationNumber;
    private LocalDate date;
    private LocalDate validUntil;

    // Client Details
    private String clientName;
    private String clientPhone;
    private String clientEmail;
    private String clientAddress;

    // Project Details
    private String projectName;
    private String projectLocation;
    private String contractType = "Material + Labour";
    private String estimatedDuration;

    // Project Scope (Structured JSON Array string)
    @Column(columnDefinition = "TEXT")
    private String projectScope;

    // Existing Estimation Hierarchy (FROZEN - PRESERVED)
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private List<Room> rooms = new ArrayList<>();

    // Material & Hardware Specifications
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private List<MaterialSpecification> materialSpecifications = new ArrayList<>();

    // Payment Milestones Schedule
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private List<PaymentMilestone> paymentMilestones = new ArrayList<>();

    // Commercial & Legal Quotation Terms
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private List<QuotationTerm> quotationTerms = new ArrayList<>();

    // Cost Summary & Commercials
    private BigDecimal subTotal = BigDecimal.ZERO;
    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal taxPercentage = BigDecimal.ZERO;
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private Double grandTotal = 0.0; // Preserved for existing calculation compatibility
    private String amountInWords;

    // Warranty & Client Acceptance Sign-off
    @Column(columnDefinition = "TEXT")
    private String warrantyTerms;
    private String clientSignName;
    private String authorizedSignatory = "Ramachandran (RR Interiors)";
}

