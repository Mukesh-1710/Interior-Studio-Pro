package com.interior.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "material_specifications")
public class MaterialSpecification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String itemName;
    private String application;
    private String brand;
    private String modelSeries;
    private String specification;
    private String thickness;
    private String finish;
    private String quantity;

    @Enumerated(EnumType.STRING)
    private MaterialResponsibility supplyResponsibility = MaterialResponsibility.RR_INTERIORS_SUPPLIED;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    private Integer sortOrder = 0;
}
