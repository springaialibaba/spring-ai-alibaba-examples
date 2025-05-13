package com.alibaba.cloud.ai.application.mcp;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import com.alibaba.cloud.ai.application.config.mcp.SyncMcpToolCallbackWrapper;
import com.alibaba.cloud.ai.application.entity.mcp.McpServer;
import com.alibaba.cloud.ai.application.entity.mcp.McpServerConfig;
import com.alibaba.cloud.ai.application.exception.SAAAppException;
import com.alibaba.cloud.ai.application.utils.ModelsUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import org.springframework.ai.mcp.SyncMcpToolCallback;
import org.springframework.ai.model.function.FunctionCallback;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

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
			if (Objects.nonNull(env)) {
				env.entrySet().stream()
						.filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty() &&
								entry.getValue().startsWith("${") && entry.getValue().endsWith("}"))
						.forEach(entry -> {
							String envKey = entry.getValue().substring(2, entry.getValue().length() - 1);
							String envValue = System.getenv(envKey);
							// allow env is null.
							if (envValue != null && !envValue.isEmpty()) {
								env.put(entry.getKey(), envValue);
							}
						});
			}
		});


		return mcpServerConfig;
	}

	public static String getLibsPath(List<String> list) {

		if (list != null && !list.isEmpty()) {
			return list.get(list.size() - 1);
		}
		return null;
	}


	public static String getMcpLibsAbsPath(String jarName) {

		File file = new File(jarName);
		if (file.isAbsolute()) {
			return file.getAbsolutePath();
		}
		
		File workDirFile = new File(System.getProperty("user.dir"), jarName);
		if (workDirFile.exists()) {
			return workDirFile.getAbsolutePath();
		}
		
		try {
			Resource resource = new ClassPathResource(jarName);
			File fileResource = resource.getFile();

			if (fileResource.exists()) {
				return fileResource.getAbsolutePath();
			}
			else {
				throw new SAAAppException("File not found: " + jarName + ", tried locations: " 
						+ workDirFile.getAbsolutePath() + ", " + fileResource.getAbsolutePath());
			}
		}
		catch (IOException e) {
			throw new SAAAppException("Cannot load file: " + jarName + ", error: " + e.getMessage());
		}
	}

	public static String getId() {

		return String.valueOf(UUID.randomUUID());
	}

	public static void initMcpServerContainer(ToolCallbackProvider toolCallbackProvider) throws IOException {

		McpServerConfig mcpServerConfig = McpServerUtils.getMcpServerConfig();
		Map<String, String> mcpServerDescMap = initMcpServerDescMap();

		mcpServerConfig.getMcpServers().forEach((key, parameters) -> {

			List<McpServer.Tools> toolsList = new ArrayList<>();
			for (FunctionCallback toolCallback : toolCallbackProvider.getToolCallbacks()) {

				// todo: 拿不到 mcp client, 先用包装器拿吧
				SyncMcpToolCallback mcpToolCallback = (SyncMcpToolCallback) toolCallback;
				SyncMcpToolCallbackWrapper syncMcpToolCallbackWrapper = new SyncMcpToolCallbackWrapper(mcpToolCallback);
				String currentMcpServerName = syncMcpToolCallbackWrapper.getMcpClient().getServerInfo().name();

				// 按照 mcp server name 聚合 mcp server tools
				if (Objects.equals(key, currentMcpServerName)) {
					McpServer.Tools tool = new McpServer.Tools();
					tool.setDesc(toolCallback.getDescription());
					tool.setName(toolCallback.getName());
					tool.setParams(toolCallback.getInputTypeSchema());

					toolsList.add(tool);
				}
			}

			McpServerContainer.addServer(McpServer.builder()
					.id(getId())
					.name(key)
					.env(parameters.env())
					.desc(mcpServerDescMap.get(key))
					.toolList(toolsList)
					.build()
			);
		});

	}

	private static Map<String, String> initMcpServerDescMap() {

		Map<String, String> map = new HashMap<>();

		map.put("weather", "天气查询");
		map.put("github", "GitHub 搜索");

		return map;
	}

}
