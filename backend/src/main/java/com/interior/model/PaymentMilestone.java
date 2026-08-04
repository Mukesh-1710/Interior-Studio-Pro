package com.interior.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "payment_milestones")
public class PaymentMilestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String milestoneName;
    private BigDecimal percentage = BigDecimal.ZERO;
    private BigDecimal amount = BigDecimal.ZERO;
    private String status = "Pending";
    private Integer sortOrder = 0;
}
