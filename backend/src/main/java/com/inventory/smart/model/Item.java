package com.inventory.smart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "items", uniqueConstraints = {
    @UniqueConstraint(columnNames = "sku")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank
    @Column(nullable = false, unique = true)
    private String sku; // Stock Keeping Unit
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @NotNull
    @Min(0)
    private Integer currentStock;
    
    @NotNull
    @Min(1)
    private Integer minimumStock;
    
    @NotNull
    @Min(0)
    private BigDecimal costPrice;
    
    @NotNull
    @Min(0)
    private BigDecimal sellingPrice;
    
    private String location;
    
    private String supplier;
    
    private LocalDate expiryDate;
    
    private String imageUrl;
    
    private boolean active = true;
    
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
} 