package com.alibaba.cloud.ai.application.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import com.alibaba.cloud.ai.application.entity.mcp.McpServerConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

public final class McpServerUtils {

	private static final String MCP_CONFIG_FILE_PATH = "mcp-config.yml";

	private McpServerUtils() {
	}

	public static McpServerConfig getMcpServerConfig() throws IOException {

		ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
		InputStream resourceAsStream = ModelsUtils.class.getClassLoader().getResourceAsStream(MCP_CONFIG_FILE_PATH);

		McpServerConfig mcpServerConfig = mapper.readValue(resourceAsStream, McpServerConfig.class);
		mcpServerConfig.getMcpServers().forEach((key, parameters) -> {
			Map<String, String> env = parameters.env();
			env.entrySet().stream()
					.filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty() &&
							entry.getValue().startsWith("${") && entry.getValue().endsWith("}"))
					.forEach(entry -> {
						String envKey = entry.getValue().substring(2, entry.getValue().length() - 1);
						String envValue = System.getenv(envKey);
						// 允许 env 为空值
						if (envValue != null && !envValue.isEmpty()) {
							env.put(entry.getKey(), envValue);
						}
					});
		});


		return mcpServerConfig;
	}

	public static String getLibsPath(List<String> list) {

		if (list != null && !list.isEmpty()) {
			return list.get(list.size() - 1);
		}
		return null;
	}

}
