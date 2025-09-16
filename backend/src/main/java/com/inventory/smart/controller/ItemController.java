package com.inventory.smart.controller;

import com.inventory.smart.dto.MessageResponse;
import com.inventory.smart.exception.ResourceNotFoundException;
import com.inventory.smart.model.Item;
import com.inventory.smart.repository.CategoryRepository;
import com.inventory.smart.repository.ItemRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/items")
public class ItemController {
    @Autowired
    private ItemRepository itemRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "id", id));
        return ResponseEntity.ok(item);
    }
    
    @GetMapping("/sku/{sku}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<Item> getItemBySku(@PathVariable String sku) {
        Item item = itemRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "sku", sku));
        return ResponseEntity.ok(item);
    }
    
    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Item> getItemsByCategory(@PathVariable Long categoryId) {
        return itemRepository.findByCategory_Id(categoryId);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Item> searchItems(@RequestParam String name) {
        return itemRepository.findByNameContainingIgnoreCase(name);
    }
    
    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Item> getLowStockItems() {
        return itemRepository.findLowStockItems();
    }
    
    @GetMapping("/expiring")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Item> getExpiringItems(@RequestParam(defaultValue = "30") int days) {
        LocalDate expiryDate = LocalDate.now().plusDays(days);
        return itemRepository.findItemsExpiringBefore(expiryDate);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> createItem(@Valid @RequestBody Item item) {
        if (itemRepository.existsBySku(item.getSku())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: SKU is already in use!"));
        }
        
        if (item.getCategory() != null && item.getCategory().getId() != null) {
            categoryRepository.findById(item.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", item.getCategory().getId()));
        }
        
        Item savedItem = itemRepository.save(item);
        return ResponseEntity.ok(savedItem);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody Item itemDetails) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "id", id));
        
        if (!item.getSku().equals(itemDetails.getSku()) && itemRepository.existsBySku(itemDetails.getSku())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: SKU is already in use!"));
        }
        
        if (itemDetails.getCategory() != null && itemDetails.getCategory().getId() != null) {
            categoryRepository.findById(itemDetails.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", itemDetails.getCategory().getId()));
        }
        
        item.setName(itemDetails.getName());
        item.setDescription(itemDetails.getDescription());
        item.setSku(itemDetails.getSku());
        item.setCategory(itemDetails.getCategory());
        item.setCurrentStock(itemDetails.getCurrentStock());
        item.setMinimumStock(itemDetails.getMinimumStock());
        item.setCostPrice(itemDetails.getCostPrice());
        item.setSellingPrice(itemDetails.getSellingPrice());
        item.setLocation(itemDetails.getLocation());
        item.setSupplier(itemDetails.getSupplier());
        item.setExpiryDate(itemDetails.getExpiryDate());
        item.setImageUrl(itemDetails.getImageUrl());
        item.setActive(itemDetails.isActive());
        
        Item updatedItem = itemRepository.save(item);
        return ResponseEntity.ok(updatedItem);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "id", id));
        
        itemRepository.delete(item);
        return ResponseEntity.ok(new MessageResponse("Item deleted successfully"));
    }
} 