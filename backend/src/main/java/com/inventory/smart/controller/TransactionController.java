package com.inventory.smart.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventory.smart.dto.TransactionDTO;
import com.inventory.smart.model.Item;
import com.inventory.smart.model.Transaction;
import com.inventory.smart.model.Transaction.TransactionType;
import com.inventory.smart.model.User;
import com.inventory.smart.repository.ItemRepository;
import com.inventory.smart.repository.TransactionRepository;
import com.inventory.smart.repository.UserRepository;
import com.inventory.smart.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<TransactionDTO> transactionDTOs = transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(transactionDTOs);
    }

    @GetMapping("/item/{itemId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByItem(@PathVariable Long itemId) {
        List<Transaction> transactions = transactionRepository.findByItemId(itemId);
        List<TransactionDTO> transactionDTOs = transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(transactionDTOs);
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        try {
            // Get the current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Find the item
            Item item = itemRepository.findById(transactionDTO.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            // Create and save the transaction
            Transaction transaction = new Transaction();
            transaction.setItem(item);
            transaction.setUser(user);
            transaction.setQuantity(transactionDTO.getQuantity());
            transaction.setType(transactionDTO.getType());
            transaction.setNotes(transactionDTO.getNotes());
            transaction.setCreatedAt(LocalDateTime.now());

            // Update the item's stock
            int newStock = item.getCurrentStock();
            if (transactionDTO.getType() == TransactionType.STOCK_IN) {
                newStock += transactionDTO.getQuantity();
            } else if (transactionDTO.getType() == TransactionType.STOCK_OUT) {
                newStock -= transactionDTO.getQuantity();
                if (newStock < 0) {
                    return ResponseEntity.badRequest().body("Stock cannot be negative");
                }
            } else if (transactionDTO.getType() == TransactionType.ADJUSTMENT) {
                newStock = transactionDTO.getQuantity(); // Direct set for adjustments
            }
            
            item.setCurrentStock(newStock);
            itemRepository.save(item);
            
            Transaction savedTransaction = transactionRepository.save(transaction);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedTransaction));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating transaction: " + e.getMessage());
        }
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setItemId(transaction.getItem().getId());
        dto.setItemName(transaction.getItem().getName());
        dto.setItemSku(transaction.getItem().getSku());
        
        if (transaction.getUser() != null) {
            dto.setUserId(transaction.getUser().getId());
            dto.setUsername(transaction.getUser().getUsername());
        }
        
        dto.setQuantity(transaction.getQuantity());
        dto.setType(transaction.getType());
        dto.setNotes(transaction.getNotes());
        dto.setCreatedAt(transaction.getCreatedAt());
        return dto;
    }
} 