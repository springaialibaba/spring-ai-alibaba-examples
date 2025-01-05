package org.springframework.ai.mcp.samples.filesystem;

import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.mcp.client.McpClient;
import org.springframework.ai.mcp.client.McpSyncClient;
import org.springframework.ai.mcp.client.transport.ServerParameters;
import org.springframework.ai.mcp.client.transport.StdioClientTransport;
import org.springframework.ai.mcp.spring.McpFunctionCallback;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.util.StringUtils;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public CommandLineRunner predefinedQuestions(ChatClient.Builder chatClientBuilder,
			List<McpFunctionCallback> functionCallbacks, ConfigurableApplicationContext context) {

		return args -> {
			var chatClient = chatClientBuilder
					.defaultFunctions(functionCallbacks.toArray(new McpFunctionCallback[0]))
					.build();

			System.out.println("Running predefined questions with AI model responses:\n");

			// Question 1
			String question1 = "Can you explain the content of the spring-ai-mcp-overview.txt file?";
			System.out.println("QUESTION: " + question1);
			System.out.println("ASSISTANT: " + chatClient.prompt(question1).call().content());

			// Question 2
			String question2 = "Pleses summarize the content of the spring-ai-mcp-overview.txt file and store it a new summary.md as Markdown format?";
			System.out.println("\nQUESTION: " + question2);
			System.out.println("ASSISTANT: " +
					chatClient.prompt(question2).call().content());

			context.close();

		};
	}

	@Bean
	public List<McpFunctionCallback> functionCallbacks(McpSyncClient mcpClient) {

		var callbacks = mcpClient.listTools(null)
				.tools()
				.stream()
				.map(tool -> new McpFunctionCallback(mcpClient, tool))
				.toList();
		return callbacks;
	}

	@Bean(destroyMethod = "close")
	public McpSyncClient mcpClient() {

		// based on
		// https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
		var stdioParams = ServerParameters.builder("npx")
				.args("-y", "@modelcontextprotocol/server-filesystem", getFilePath())
				.build();

		var mcpClient = McpClient.using(new StdioClientTransport(stdioParams))
				.requestTimeout(Duration.ofSeconds(10)).sync();

		var init = mcpClient.initialize();

		System.out.println("MCP Initialized: " + init);

		return mcpClient;

	}

	private static String getFilePath() {
		String path = System.getenv("MCP_FILE_DIRECTORY_PATH");
		return StringUtils.isEmpty(path) ? getDbPath() : path;
	}

	private static String getDbPath() {
		return Paths.get(System.getProperty("user.dir")).toString();
	}

}