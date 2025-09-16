package com.inventory.smart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private String orderNumber;
    
    @Enumerated(EnumType.STRING)
    private OrderType orderType;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private String customer;
    
    private String supplier;
    
    @NotNull
    private BigDecimal totalAmount;
    
    private String notes;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
    
    private String createdBy;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum OrderType {
        PURCHASE,
        SALE
    }
    
    public enum OrderStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        CANCELLED
    }
} 