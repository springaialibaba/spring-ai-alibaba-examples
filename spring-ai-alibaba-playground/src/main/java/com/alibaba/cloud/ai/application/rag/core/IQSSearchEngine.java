package com.alibaba.cloud.ai.application.rag.core;

import java.util.Objects;
import java.util.function.Consumer;

import com.alibaba.cloud.ai.application.exception.SAAAppException;
import com.alibaba.cloud.ai.application.rag.IQSSearchProperties;
import com.alibaba.cloud.ai.application.entity.websearch.GenericSearchResult;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestClient;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Component
@EnableConfigurationProperties(IQSSearchProperties.class)
public class IQSSearchEngine {

	private final IQSSearchProperties iqsSearchProperties;

	private final RestClient restClient;

	private static final String BASE_URL = "https://cloud-iqs.aliyuncs.com/";

	private static final String TIME_RANGE = "OneWeek";

	public IQSSearchEngine(
			IQSSearchProperties iqsSearchProperties,
			RestClient.Builder restClientBuilder,
			ResponseErrorHandler responseErrorHandler
	) {

		this.iqsSearchProperties = iqsSearchProperties;
		this.restClient = restClientBuilder.baseUrl(BASE_URL)
				.defaultHeaders(getHeaders())
				.defaultStatusHandler(responseErrorHandler)
				.build();
	}

	public GenericSearchResult search(String query) {

		// String encodeQ = URLEncoder.encode(query, StandardCharsets.UTF_8);
		ResponseEntity<GenericSearchResult> resultResponseEntity = run(query);

		return genericSearchResult(resultResponseEntity);
	}

	private ResponseEntity<GenericSearchResult> run(String query) {

		return this.restClient.get()
				.uri(
						"/search/genericSearch?query={query}&timeRange={timeRange}",
						query,
						TIME_RANGE
				).retrieve()
				.toEntity(GenericSearchResult.class);
	}

	private GenericSearchResult genericSearchResult(ResponseEntity<GenericSearchResult> response) {

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
