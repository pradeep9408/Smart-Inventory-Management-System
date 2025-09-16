package com.inventory.smart.controller;

import com.inventory.smart.dto.MessageResponse;
import com.inventory.smart.exception.ResourceNotFoundException;
import com.inventory.smart.model.Supplier;
import com.inventory.smart.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/suppliers")
public class SupplierController {
    @Autowired
    private SupplierRepository supplierRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        return ResponseEntity.ok(supplier);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplierDetails) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        
        supplier.setName(supplierDetails.getName());
        supplier.setContactName(supplierDetails.getContactName());
        supplier.setEmail(supplierDetails.getEmail());
        supplier.setPhone(supplierDetails.getPhone());
        supplier.setAddress(supplierDetails.getAddress());
        supplier.setNotes(supplierDetails.getNotes());
        
        Supplier updatedSupplier = supplierRepository.save(supplier);
        return ResponseEntity.ok(updatedSupplier);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        
        // Soft delete
        supplier.setActive(false);
        supplierRepository.save(supplier);
        
        return ResponseEntity.ok(new MessageResponse("Supplier deactivated successfully"));
    }
} 