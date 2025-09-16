package com.inventory.smart.repository;

import com.inventory.smart.model.Order;
import com.inventory.smart.model.Order.OrderStatus;
import com.inventory.smart.model.Order.OrderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByOrderType(OrderType orderType);
    
    List<Order> findByStatus(OrderStatus status);
    
    List<Order> findByCustomerContainingIgnoreCase(String customer);
    
    List<Order> findBySupplierContainingIgnoreCase(String supplier);
    
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    Boolean existsByOrderNumber(String orderNumber);
} 