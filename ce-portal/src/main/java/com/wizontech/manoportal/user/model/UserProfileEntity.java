package com.wizontech.manoportal.user.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "TableProfile")
public class UserProfileEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "UserID", referencedColumnName = "id")
  private UserEntity user;

  private String userGroup; // group : db reserved word
  private String status;
  private String email;
  private String phone;

  public UserProfileDto toDto() {
    return UserProfileDto.builder()
            .userGroup(this.getUserGroup())
            .status(this.getStatus())
            .email(this.getEmail())
            .phone(this.getPhone())
            .build();
  }
}