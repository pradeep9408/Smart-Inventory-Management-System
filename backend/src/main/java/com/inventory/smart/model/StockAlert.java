package com.inventory.smart.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;
    
    @Enumerated(EnumType.STRING)
    private AlertType alertType;
    
    private String message;
    
    @Enumerated(EnumType.STRING)
    private AlertStatus status;
    
    private LocalDateTime resolvedAt;
    
    private String resolvedBy;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum AlertType {
        LOW_STOCK,
        OUT_OF_STOCK,
        EXPIRY_APPROACHING,
        EXPIRED
    }
    
    public enum AlertStatus {
        ACTIVE,
        RESOLVED,
        IGNORED
    }
} 