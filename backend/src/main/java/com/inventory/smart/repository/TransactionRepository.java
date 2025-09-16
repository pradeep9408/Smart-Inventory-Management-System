package com.inventory.smart.repository;

import com.inventory.smart.model.Item;
import com.inventory.smart.model.Transaction;
import com.inventory.smart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByItem(Item item);
    List<Transaction> findByUser(User user);
    List<Transaction> findByType(Transaction.TransactionType type);
    List<Transaction> findByItemId(Long itemId);
} 