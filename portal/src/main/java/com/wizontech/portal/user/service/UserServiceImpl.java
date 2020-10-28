package com.wizontech.portal.user.service;

import com.wizontech.portal.user.model.UserEntity;
import com.wizontech.portal.user.model.UserProfileDto;
import com.wizontech.portal.user.model.UserProfileEntity;
import com.wizontech.portal.user.model.UserResponseDto;
import com.wizontech.portal.user.persistence.UserProfileRepository;
import com.wizontech.portal.user.persistence.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javassist.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserDetailsService {

  private final UserRepository userRepository;
  private final UserProfileRepository userProfileRepository;

  @Transactional(readOnly = true)
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserEntity loginUser = userRepository.findByUsername(username).orElse(null);
    if (loginUser == null) {
      throw new UsernameNotFoundException(username + "을 찾을 수 없습니다.");
    }

    return UserResponseDto.builder()
            .id(loginUser.getId())
            .username(loginUser.getUsername())
            .password(loginUser.getPassword())
            .build();
  }

  @Transactional(readOnly = true)
  public UserProfileEntity getProfile(Long id) {
    log.debug("id : {}", id);
    UserProfileEntity profile = userProfileRepository.findById(id).orElse(null);
    if (profile == null) {
      try {
        throw new NotFoundException("해당 프로필을 조회할 수 없습니다.");
      } catch (NotFoundException e) {
        e.printStackTrace();
        return new UserProfileEntity();
      }
    }
    return profile;
  }

  @Transactional
  public void updateProfile(Long id, UserProfileDto updateProfile) {
    UserEntity user = UserEntity.builder().id(id).build();
    userProfileRepository.findByUser(user).ifPresent(origin -> {
      origin.setEmail(updateProfile.getEmail());
      origin.setPhone(updateProfile.getPhone());
      origin.setStatus(updateProfile.getStatus());
      origin.setUserGroup(updateProfile.getUserGroup());
      userProfileRepository.save(origin);
    });
  }
}