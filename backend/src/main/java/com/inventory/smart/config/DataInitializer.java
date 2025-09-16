package com.inventory.smart.config;

import com.inventory.smart.exception.ResourceNotFoundException;
import com.inventory.smart.model.Category;
import com.inventory.smart.model.Role;
import com.inventory.smart.model.Role.ERole;
import com.inventory.smart.model.User;
import com.inventory.smart.repository.CategoryRepository;
import com.inventory.smart.repository.RoleRepository;
import com.inventory.smart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        initRoles();
        
        // Create admin user if it doesn't exist
        createAdminUser();
        
        // Initialize categories if they don't exist
        initCategories();
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            Role adminRole = new Role(ERole.ROLE_ADMIN);
            Role employeeRole = new Role(ERole.ROLE_EMPLOYEE);
            Role managerRole = new Role(ERole.ROLE_MANAGER);
            
            roleRepository.save(adminRole);
            roleRepository.save(employeeRole);
            roleRepository.save(managerRole);
            
            System.out.println("Roles initialized successfully");
        }
    }

    private void createAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setPhone("1234567890");
            admin.setCreatedBy("System");
            admin.setActive(true);
            
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", ERole.ROLE_ADMIN));
            roles.add(adminRole);
            
            admin.setRoles(roles);
            userRepository.save(admin);
            
            System.out.println("Admin user created successfully");
        }
    }
    
    private void initCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> defaultCategories = Arrays.asList(
                createCategory("Electronics", "Electronic devices and components"),
                createCategory("Office Supplies", "Stationery, paper products, and office equipment"),
                createCategory("Furniture", "Office and home furniture items"),
                createCategory("Food & Beverages", "Consumable food and drink items"),
                createCategory("Clothing", "Apparel and wearable items"),
                createCategory("Tools", "Hand tools, power tools, and equipment"),
                createCategory("Raw Materials", "Materials used in manufacturing"),
                createCategory("Packaging", "Boxes, containers, and packaging materials"),
                createCategory("Cleaning Supplies", "Janitorial and cleaning products"),
                createCategory("Medical Supplies", "Healthcare and medical equipment")
            );
            
            categoryRepository.saveAll(defaultCategories);
            System.out.println("Default categories initialized successfully");
        }
    }
    
    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setActive(true);
        category.setCreatedBy("System");
        return category;
    }
} 