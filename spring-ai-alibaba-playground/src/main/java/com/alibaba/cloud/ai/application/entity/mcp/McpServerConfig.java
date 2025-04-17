package com.alibaba.cloud.ai.application.entity.mcp;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.springframework.ai.autoconfigure.mcp.client.properties.McpStdioClientProperties;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

public class McpServerConfig {

	@JsonProperty("mcpServers")
	private Map<String, McpStdioClientProperties.Parameters> mcpServers;

	public Map<String, McpStdioClientProperties.Parameters> getMcpServers() {
		return mcpServers;
	}

	public void setMcpServers(Map<String, McpStdioClientProperties.Parameters> mcpServers) {
		this.mcpServers = mcpServers;
	}

}
