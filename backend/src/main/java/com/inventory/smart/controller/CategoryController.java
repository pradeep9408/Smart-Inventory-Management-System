package com.inventory.smart.controller;

import com.inventory.smart.dto.CategoryDTO;
import com.inventory.smart.dto.MessageResponse;
import com.inventory.smart.exception.ResourceNotFoundException;
import com.inventory.smart.model.Category;
import com.inventory.smart.repository.CategoryRepository;
import com.inventory.smart.repository.ItemRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        
        return categories.stream()
                .map(category -> {
                    int itemCount = itemRepository.countByCategory_Id(category.getId());
                    return CategoryDTO.fromCategory(category, itemCount);
                })
                .collect(Collectors.toList());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        
        int itemCount = itemRepository.countByCategory_Id(category.getId());
        CategoryDTO categoryDTO = CategoryDTO.fromCategory(category, itemCount);
        
        return ResponseEntity.ok(categoryDTO);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<CategoryDTO> searchCategories(@RequestParam String name) {
        List<Category> categories = categoryRepository.findByNameContainingIgnoreCase(name);
        
        return categories.stream()
                .map(category -> {
                    int itemCount = itemRepository.countByCategory_Id(category.getId());
                    return CategoryDTO.fromCategory(category, itemCount);
                })
                .collect(Collectors.toList());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestBody Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Category name already exists!"));
        }
        
        Category savedCategory = categoryRepository.save(category);
        CategoryDTO categoryDTO = CategoryDTO.fromCategory(savedCategory, 0);
        
        return ResponseEntity.ok(categoryDTO);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        
        if (!category.getName().equals(categoryDetails.getName()) && 
                categoryRepository.existsByName(categoryDetails.getName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Category name already exists!"));
        }
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setActive(categoryDetails.isActive());
        
        Category updatedCategory = categoryRepository.save(category);
        int itemCount = itemRepository.countByCategory_Id(updatedCategory.getId());
        CategoryDTO categoryDTO = CategoryDTO.fromCategory(updatedCategory, itemCount);
        
        return ResponseEntity.ok(categoryDTO);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        
        categoryRepository.delete(category);
        return ResponseEntity.ok(new MessageResponse("Category deleted successfully"));
    }
} 