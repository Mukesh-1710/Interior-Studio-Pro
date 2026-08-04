package com.interior.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "quotation_terms")
public class QuotationTerm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String termText;

    private Integer sortOrder = 0;
}
