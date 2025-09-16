package com.inventory.smart.dto;

import com.inventory.smart.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private boolean active;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int itemCount;
    
    public static CategoryDTO fromCategory(Category category, int itemCount) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setActive(category.isActive());
        dto.setCreatedBy(category.getCreatedBy());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());
        dto.setItemCount(itemCount);
        return dto;
    }
} 