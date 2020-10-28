package com.wizontech.portal.user.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

  @JsonIgnore
  private UserEntity user;

  // @Pattern(regexp = "^[a-z가-힣A-Z\\s]*$", message = "입력하신 실명을 다시 확인해주세요.")
  // @NotEmpty(message = "실명은 필수 입력 사항입니다.")
  // private String realName;

  @NotEmpty(message = "그룹은 필수 입력 사항입니다.")
  private String userGroup; // group : db reserved word

  private String status;

  @Email(message = "이메일 형식으로 입력해 주세요.", regexp = "^[a-z0-9_+.-]+@([a-z0-9-]+.)+[a-z0-9]{2,4}$")
  private String email;

  @Pattern(regexp = "^[0-9]{0,12}$", message = "전화번호는 11자리 이하의 숫자만 입력해 주세요.")
  @Length(min = 0, max = 11, message = "전화번호는 11자리 이하로 입력해 주세요.")
  private String phone;

  public UserProfileEntity toEntity() {
    return UserProfileEntity.builder()
            .user(this.user)
            .userGroup(this.userGroup)
            .status(this.status)
            .email(this.email)
            .phone(this.phone)
            .build();
  }
}