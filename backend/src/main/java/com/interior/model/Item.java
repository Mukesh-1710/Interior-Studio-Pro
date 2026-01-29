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
    private Double qty;
    private String unit; // "sq.ft" or "no."
    private Double rate;
    private Double amount;
}
