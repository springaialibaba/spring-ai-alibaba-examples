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

package com.alibaba.cloud.ai.application.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "request_time", nullable = false)
	private String requestTime;

	@Column(name = "request_ip", nullable = false)
	private String requestIp;

	@Column(name = "request_count", nullable = false)
	private int requestCount;

	@Column(name = "max_request_count", nullable = false)
	private int maxRequestCount = Integer.MAX_VALUE;

	@Column(name = "request_uri", nullable = false)
	private String requestUri;

	// 默认构造函数
	public User() {}

	// 带参数的构造函数
	public User(
			String requestTime,
			String requestIp,
			int requestCount,
			String requestUri
	) {
		this.requestTime = requestTime;
		this.requestIp = requestIp;
		this.requestCount = requestCount;
		this.requestUri = requestUri;
	}

	public static class Builder {
		private String requestTime;
		private String requestIp;
		private int requestCount;
		private String requestUri;

		public Builder setRequestTime(String requestTime) {
			this.requestTime = requestTime;
			return this;
		}

		public Builder setRequestIp(String requestIp) {
			this.requestIp = requestIp;
			return this;
		}

		public Builder setRequestCount(int requestCount) {
			this.requestCount = requestCount;
			return this;
		}

		public Builder setRequestUri(String requestUri) {
			this.requestUri = requestUri;
			return this;
		}

		public User build() {
			return new User(requestTime, requestIp, requestCount, requestUri);
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(String requestTime) {
		this.requestTime = requestTime;
	}

	public String getRequestIp() {
		return requestIp;
	}

	public void setRequestIp(String requestIp) {
		this.requestIp = requestIp;
	}

	public int getRequestCount() {
		return requestCount;
	}

	public void setRequestCount(int requestCount) {
		this.requestCount = requestCount;
	}

	public int getMaxRequestCount() {
		return maxRequestCount;
	}

	public void setMaxRequestCount(int maxRequestCount) {
		this.maxRequestCount = maxRequestCount;
	}

	public String getRequestUri() {
		return requestUri;
	}

	public void setRequestUri(String requestUri) {
		this.requestUri = requestUri;
	}

}
