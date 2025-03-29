/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.alibaba.cloud.ai.application.aop;

import com.alibaba.cloud.ai.application.entity.User;
import com.alibaba.cloud.ai.application.repository.UserRepository;
import com.alibaba.cloud.ai.application.utils.TimeUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Component;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Aspect
@Component
public class UserIpAspect {

	private final Logger logger = LoggerFactory.getLogger(UserIpAspect.class);

	private final HttpServletRequest request;

	private final UserRepository userRepository;

	public UserIpAspect(
			HttpServletRequest request,
			UserRepository userRepository
	) {
		this.request = request;
		this.userRepository = userRepository;
	}

	@Pointcut("@annotation(com.alibaba.cloud.ai.application.annotation.UserIp)")
	public void logUserIp() {
	}

	@After("logUserIp()")
	public void after() {

		String userIp = request.getRemoteAddr();
		String requestUri = request.getRequestURI();
		String requestTime = TimeUtils.getCurrentTime();

		logger.info("User IP: {}, Time: {}, Uri: {}", userIp, requestTime, requestUri);

		userRepository.findByRequestIp(userIp)
				.ifPresentOrElse(
						user -> {
							user.setRequestCount(user.getRequestCount() + 1);
							user.setRequestUri(user.getRequestUri() + ", " + requestUri);
							userRepository.save(user);
						},
						() -> {
							User newUser = new User.Builder()
									.setRequestUri(requestUri)
									.setRequestTime(requestTime)
									.setRequestIp(userIp)
									.setRequestCount(1)
									.build();
							userRepository.save(newUser);
						}
				);
	}

}
