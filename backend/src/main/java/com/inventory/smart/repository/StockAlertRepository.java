package com.inventory.smart.repository;

import com.inventory.smart.model.StockAlert;
import com.inventory.smart.model.StockAlert.AlertStatus;
import com.inventory.smart.model.StockAlert.AlertType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {
    List<StockAlert> findByStatus(AlertStatus status);
    
    List<StockAlert> findByAlertType(AlertType alertType);
    
    List<StockAlert> findByItem_Id(Long itemId);
    
    List<StockAlert> findByStatusAndAlertType(AlertStatus status, AlertType alertType);
} 