package com.alibaba.example.rag.search.websearch.core;

import java.util.function.Consumer;

import com.alibaba.example.rag.search.websearch.WebSearchProperties;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Component
public class SearchEngine {

	private final WebSearchProperties properties;

	public SearchEngine(WebSearchProperties properties) {
		this.properties = properties;
	}

	public ResponseEntity<Object> search(String query) {

		// url 编码

		return null;
	}

	private Consumer<HttpHeaders> getHeaders() {
		return headers -> {
			headers.set("X-API-KEY", properties.getIqsKey());
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("user-agent", getUserAgent());
		};
	}

	private String getUserAgent() {

		return "";
	}

}
