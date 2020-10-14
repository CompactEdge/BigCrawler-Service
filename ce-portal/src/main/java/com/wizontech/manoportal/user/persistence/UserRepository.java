package com.wizontech.manoportal.user.persistence;

import java.util.Optional;

import com.wizontech.manoportal.user.model.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

	Optional<UserEntity> findByUsername(String username);

}