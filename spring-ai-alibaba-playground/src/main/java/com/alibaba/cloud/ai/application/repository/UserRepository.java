package com.alibaba.cloud.ai.application.repository;

import java.util.Optional;

import com.alibaba.cloud.ai.application.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByRequestIp(String userIp);

}
