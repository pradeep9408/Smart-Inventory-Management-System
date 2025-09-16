package com.inventory.smart.controller;

import com.inventory.smart.dto.MessageResponse;
import com.inventory.smart.exception.ResourceNotFoundException;
import com.inventory.smart.model.Item;
import com.inventory.smart.model.Order;
import com.inventory.smart.model.OrderItem;
import com.inventory.smart.repository.ItemRepository;
import com.inventory.smart.repository.OrderRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/type/{orderType}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Order> getOrdersByType(@PathVariable Order.OrderType orderType) {
        return orderRepository.findByOrderType(orderType);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Order> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    @GetMapping("/customer")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Order> getOrdersByCustomer(@RequestParam String customer) {
        return orderRepository.findByCustomerContainingIgnoreCase(customer);
    }
    
    @GetMapping("/supplier")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Order> getOrdersBySupplier(@RequestParam String supplier) {
        return orderRepository.findBySupplierContainingIgnoreCase(supplier);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Order> getOrdersByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> createOrder(@Valid @RequestBody Order order) {
        if (orderRepository.existsByOrderNumber(order.getOrderNumber())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Order number already exists!"));
        }
        
        // Validate and update inventory for each order item
        for (OrderItem orderItem : order.getOrderItems()) {
            Item item = itemRepository.findById(orderItem.getItem().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Item", "id", orderItem.getItem().getId()));
            
            orderItem.setOrder(order);
            
            // Update inventory based on order type
            if (order.getOrderType() == Order.OrderType.PURCHASE) {
                // Increase stock for purchases
                item.setCurrentStock(item.getCurrentStock() + orderItem.getQuantity());
            } else if (order.getOrderType() == Order.OrderType.SALE) {
                // Decrease stock for sales
                if (item.getCurrentStock() < orderItem.getQuantity()) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Not enough stock for item: " + item.getName()));
                }
                item.setCurrentStock(item.getCurrentStock() - orderItem.getQuantity());
            }
            
            itemRepository.save(item);
        }
        
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        
        return ResponseEntity.ok(updatedOrder);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        
        if (order.getStatus() == Order.OrderStatus.COMPLETED) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Cannot cancel a completed order!"));
        }
        
        // Revert inventory changes if order is being cancelled
        if (order.getStatus() != Order.OrderStatus.CANCELLED) {
            for (OrderItem orderItem : order.getOrderItems()) {
                Item item = itemRepository.findById(orderItem.getItem().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Item", "id", orderItem.getItem().getId()));
                
                // Revert inventory based on order type
                if (order.getOrderType() == Order.OrderType.PURCHASE) {
                    // Decrease stock for cancelled purchases
                    item.setCurrentStock(item.getCurrentStock() - orderItem.getQuantity());
                } else if (order.getOrderType() == Order.OrderType.SALE) {
                    // Increase stock for cancelled sales
                    item.setCurrentStock(item.getCurrentStock() + orderItem.getQuantity());
                }
                
                itemRepository.save(item);
            }
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        return ResponseEntity.ok(new MessageResponse("Order cancelled successfully!"));
    }
} 