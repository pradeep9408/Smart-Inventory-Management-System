package com.inventory.smart.repository;

import com.inventory.smart.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findBySku(String sku);
    
    List<Item> findByCategory_Id(Long categoryId);
    
    int countByCategory_Id(Long categoryId);
    
    List<Item> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT i FROM Item i WHERE i.currentStock <= i.minimumStock AND i.active = true")
    List<Item> findLowStockItems();
    
    @Query("SELECT i FROM Item i WHERE i.expiryDate IS NOT NULL AND i.expiryDate <= :date AND i.active = true")
    List<Item> findItemsExpiringBefore(LocalDate date);
    
    Boolean existsBySku(String sku);
} 