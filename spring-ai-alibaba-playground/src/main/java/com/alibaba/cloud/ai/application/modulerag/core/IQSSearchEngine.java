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

package com.alibaba.cloud.ai.application.modulerag.core;

import com.alibaba.cloud.ai.application.entity.IQSSearchResponse;
import com.alibaba.cloud.ai.application.exception.SAAAppException;
import com.alibaba.cloud.ai.application.modulerag.IQSSearchProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Consumer;

/**
 * <a href="https://help.aliyun.com/document_detail/2883041.html">通晓搜索</a>
 *
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Component
@EnableConfigurationProperties(IQSSearchProperties.class)
public class IQSSearchEngine {

	private final RestClient restClient;

	private final ObjectMapper objectMapper;

	private final IQSSearchProperties iqsSearchProperties;

	private static final String TIME_RANGE = "OneWeek";

	private static final String BASE_URL = "https://cloud-iqs.aliyuncs.com/";

	public IQSSearchEngine(
			ObjectMapper objectMapper,
			RestClient.Builder restClientBuilder,
			IQSSearchProperties iqsSearchProperties,
			ResponseErrorHandler responseErrorHandler
	) {

		this.objectMapper = new ObjectMapper();
		this.iqsSearchProperties = iqsSearchProperties;
		this.restClient = restClientBuilder.baseUrl(BASE_URL)
				.defaultHeaders(getHeaders())
				.defaultStatusHandler(responseErrorHandler)
				.build();
	}

	public IQSSearchResponse search(String query) throws JsonProcessingException {

		Map<String, Boolean> reqDataContents = new HashMap<>();
		reqDataContents.put("mainText", true);
		// IQS 目前得 md 文档效果不好，所以关闭.
		reqDataContents.put("markdownText", false);
		reqDataContents.put("rerankScore", true);
		Map<String, Object> reqData = new HashMap<>();
		reqData.put("query", query);
		reqData.put("timeRange", TIME_RANGE);
		reqData.put("engineType", "Generic");
		reqData.put("contents", reqDataContents);
		String jsonReqData = objectMapper.writeValueAsString(reqData);

		// String encodeQ = URLEncoder.encode(query, StandardCharsets.UTF_8);
		ResponseEntity<IQSSearchResponse> response = this.restClient.post()
				.uri(
						"/search/unified?query={query}&timeRange={timeRange}",
						query,
						TIME_RANGE
				).contentType(MediaType.APPLICATION_JSON)
				.body(jsonReqData)
				.retrieve()
				.toEntity(IQSSearchResponse.class);

		return genericSearchResult(response);
	}

	private IQSSearchResponse genericSearchResult(ResponseEntity<IQSSearchResponse> response) {

		if ((Objects.equals(response.getStatusCode(), HttpStatus.OK)) && Objects.nonNull(response.getBody())) {
			return response.getBody();
		}

		throw new SAAAppException("Failed to search" + response.getStatusCode().value());
	}

	private Consumer<HttpHeaders> getHeaders() {

		return httpHeaders -> {

			httpHeaders.setContentType(MediaType.APPLICATION_JSON);
			httpHeaders.set("user-agent", userAgent());

			if (StringUtils.hasText(this.iqsSearchProperties.getApiKey())) {
				httpHeaders.set("X-API-Key", this.iqsSearchProperties.getApiKey());
			}
		};
	}

	private static String userAgent() {

		return String.format("%s/%s; java/%s; platform/%s; processor/%s", "SpringAiAlibabaPlayground", "1.0.0", System.getProperty("java.version"), System.getProperty("os.name"), System.getProperty("os.arch"));
	}

}
