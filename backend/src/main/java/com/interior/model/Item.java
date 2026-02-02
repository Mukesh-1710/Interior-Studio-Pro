package com.interior.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private Double length;
    private Double width;
    private Integer pieces;
    private Double totalArea;
    private String unit; // "sq.ft" or "pcs"
    private Double rate;
    private Double amount;
}
