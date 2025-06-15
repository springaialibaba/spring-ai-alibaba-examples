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

package com.alibaba.cloud.ai.application.config;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.util.Timeout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.util.concurrent.TimeUnit;

/**
 * Resolve the request timeout issue, need import org.apache.httpcomponents.client5:httplcient5 dependency.
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>

 */

@Configuration
public class RestConfiguration {

    private static final Logger log = LoggerFactory.getLogger(RestConfiguration.class);

	@Bean
	public RestClient.Builder createRestClient() {

        log.info("Initializing RestClient with custom timeout configuration");

		RequestConfig requestConfig = RequestConfig.custom()
				.setConnectTimeout(Timeout.of(10, TimeUnit.MINUTES))
				.setResponseTimeout(Timeout.of(10, TimeUnit.MINUTES))
				.setConnectionRequestTimeout(Timeout.of(10, TimeUnit.MINUTES))
				.build();

		HttpClient httpClient = HttpClients.custom().setDefaultRequestConfig(requestConfig).build();

		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);

		return RestClient.builder().requestFactory(requestFactory);
	}

}
