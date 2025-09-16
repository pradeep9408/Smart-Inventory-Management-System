package com.inventory.smart.controller;

import com.inventory.smart.dto.MessageResponse;
import com.inventory.smart.exception.ResourceNotFoundException;
import com.inventory.smart.model.StockAlert;
import com.inventory.smart.repository.ItemRepository;
import com.inventory.smart.repository.StockAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/alerts")
public class StockAlertController {
    @Autowired
    private StockAlertRepository alertRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<StockAlert> getAllAlerts() {
        return alertRepository.findAll();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<StockAlert> getAlertById(@PathVariable Long id) {
        StockAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", id));
        return ResponseEntity.ok(alert);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<StockAlert> getAlertsByStatus(@PathVariable StockAlert.AlertStatus status) {
        return alertRepository.findByStatus(status);
    }
    
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<StockAlert> getAlertsByType(@PathVariable StockAlert.AlertType type) {
        return alertRepository.findByAlertType(type);
    }
    
    @GetMapping("/item/{itemId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<StockAlert> getAlertsByItem(@PathVariable Long itemId) {
        return alertRepository.findByItem_Id(itemId);
    }
    
    @GetMapping("/active/{type}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<StockAlert> getActiveAlertsByType(@PathVariable StockAlert.AlertType type) {
        return alertRepository.findByStatusAndAlertType(StockAlert.AlertStatus.ACTIVE, type);
    }
    
    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateAlerts() {
        // Generate low stock alerts
        List<StockAlert> lowStockAlerts = generateLowStockAlerts();
        
        // Generate expiry alerts
        List<StockAlert> expiryAlerts = generateExpiryAlerts();
        
        return ResponseEntity.ok(new MessageResponse("Generated " + 
                (lowStockAlerts.size() + expiryAlerts.size()) + " alerts"));
    }
    
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> resolveAlert(@PathVariable Long id, @RequestParam String resolvedBy) {
        StockAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", id));
        
        alert.setStatus(StockAlert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolvedBy(resolvedBy);
        
        alertRepository.save(alert);
        
        return ResponseEntity.ok(new MessageResponse("Alert resolved successfully"));
    }
    
    @PutMapping("/{id}/ignore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> ignoreAlert(@PathVariable Long id) {
        StockAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", id));
        
        alert.setStatus(StockAlert.AlertStatus.IGNORED);
        
        alertRepository.save(alert);
        
        return ResponseEntity.ok(new MessageResponse("Alert ignored"));
    }
    
    private List<StockAlert> generateLowStockAlerts() {
        // Find items with low stock
        List<StockAlert> alerts = alertRepository.findByStatusAndAlertType(
                StockAlert.AlertStatus.ACTIVE, StockAlert.AlertType.LOW_STOCK);
        
        // Create a set of item IDs that already have active low stock alerts
        java.util.Set<Long> itemsWithAlerts = new java.util.HashSet<>();
        for (StockAlert alert : alerts) {
            itemsWithAlerts.add(alert.getItem().getId());
        }
        
        // Find items with low stock
        List<StockAlert> newAlerts = new java.util.ArrayList<>();
        itemRepository.findLowStockItems().forEach(item -> {
            if (!itemsWithAlerts.contains(item.getId())) {
                StockAlert alert = new StockAlert();
                alert.setItem(item);
                alert.setAlertType(StockAlert.AlertType.LOW_STOCK);
                alert.setMessage("Low stock alert: " + item.getName() + " has only " + 
                        item.getCurrentStock() + " units left (minimum: " + item.getMinimumStock() + ")");
                alert.setStatus(StockAlert.AlertStatus.ACTIVE);
                
                newAlerts.add(alertRepository.save(alert));
            }
        });
        
        return newAlerts;
    }
    
    private List<StockAlert> generateExpiryAlerts() {
        // Find items expiring in the next 30 days
        LocalDate expiryDate = LocalDate.now().plusDays(30);
        
        List<StockAlert> alerts = alertRepository.findByStatusAndAlertType(
                StockAlert.AlertStatus.ACTIVE, StockAlert.AlertType.EXPIRY_APPROACHING);
        
        // Create a set of item IDs that already have active expiry alerts
        java.util.Set<Long> itemsWithAlerts = new java.util.HashSet<>();
        for (StockAlert alert : alerts) {
            itemsWithAlerts.add(alert.getItem().getId());
        }
        
        // Find items expiring soon
        List<StockAlert> newAlerts = new java.util.ArrayList<>();
        itemRepository.findItemsExpiringBefore(expiryDate).forEach(item -> {
            if (!itemsWithAlerts.contains(item.getId())) {
                StockAlert alert = new StockAlert();
                alert.setItem(item);
                alert.setAlertType(StockAlert.AlertType.EXPIRY_APPROACHING);
                alert.setMessage("Expiry alert: " + item.getName() + " will expire on " + 
                        item.getExpiryDate());
                alert.setStatus(StockAlert.AlertStatus.ACTIVE);
                
                newAlerts.add(alertRepository.save(alert));
            }
        });
        
        return newAlerts;
    }
} 