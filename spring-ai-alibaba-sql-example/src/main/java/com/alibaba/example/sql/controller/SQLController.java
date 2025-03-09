package com.alibaba.example.sql.controller;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

import com.alibaba.example.sql.SQLGenerationException;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SQLController {

	@Value("classpath:/schema.sql")
	private Resource ddlResource;

	@Value("classpath:/sql-prompt-template.st")
	private Resource sqlPromptTemplateResource;

	private final ChatClient chatClient;
	private final JdbcTemplate jdbcTemplate;

	public SQLController(
			ChatClient.Builder aiClientBuilder,
			JdbcTemplate jdbcTemplate
	) {

		this.chatClient = aiClientBuilder.build();
		this.jdbcTemplate = jdbcTemplate;
	}

	@PostMapping(path = "/sql")
	public Answer sql(@RequestBody SqlRequest sqlRequest) throws IOException {

		String schema = ddlResource.getContentAsString(Charset.defaultCharset());

		String query = chatClient.prompt()
				.user(userSpec -> userSpec
						.text(sqlPromptTemplateResource)
						.param("question", sqlRequest.question())
						.param("ddl", schema)
				)
				.call()
				.content();

		assert query != null;
		if (query.toLowerCase().startsWith("select")) {

			return new Answer(
					query,
					jdbcTemplate.queryForList(query)
			);
		}

		throw new SQLGenerationException(query);
	}

	public record SqlRequest(String question) { }

	public record Answer(String sqlQuery, List<Map<String, Object>> results) { }

}
