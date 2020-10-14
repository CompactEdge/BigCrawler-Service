package com.wizontech.manoportal.user.persistence;

import java.util.Optional;

import com.wizontech.manoportal.user.model.UserEntity;
import com.wizontech.manoportal.user.model.UserProfileEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfileEntity, Long> {

	Optional<UserProfileEntity> findById(Long id);

	Optional<UserProfileEntity> findByUser(UserEntity user);

}