/*
 * Copyright 2025-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author yHong
 */

package com.alibaba.example.graph.conf;

import com.alibaba.cloud.ai.graph.*;
import com.alibaba.example.graph.dispatcher.FeedbackDispatcher;
import com.alibaba.example.graph.node.RewordingNode;
import com.alibaba.example.graph.node.SummarizerNode;
import com.alibaba.example.graph.node.SummaryFeedbackClassifierNode;
import com.alibaba.example.graph.node.TitleGeneratorNode;
import org.springframework.ai.chat.model.ChatModel;
import com.alibaba.cloud.ai.graph.state.strategy.ReplaceStrategy;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

import static com.alibaba.cloud.ai.graph.StateGraph.END;
import static com.alibaba.cloud.ai.graph.StateGraph.START;
import static com.alibaba.cloud.ai.graph.action.AsyncEdgeAction.edge_async;
import static com.alibaba.cloud.ai.graph.action.AsyncNodeAction.node_async;

/**
 * @author yHong
 * @version 1.0
 * @since 2025/4/24 14:29
 */
@Configuration
public class WritingAssistantAutoconfiguration {

	@Bean
	public StateGraph writingAssistantGraph(ChatModel chatModel) throws GraphStateException {

		ChatClient chatClient = ChatClient.builder(chatModel).defaultAdvisors(new SimpleLoggerAdvisor()).build();

		OverAllStateFactory stateFactory = () -> {
			OverAllState state = new OverAllState();
			state.registerKeyAndStrategy("original_text", new ReplaceStrategy());
			state.registerKeyAndStrategy("summary", new ReplaceStrategy());
			state.registerKeyAndStrategy("summary_feedback", new ReplaceStrategy());
			state.registerKeyAndStrategy("reworded", new ReplaceStrategy());
			state.registerKeyAndStrategy("title", new ReplaceStrategy());
			return state;
		};

		StateGraph graph = new StateGraph("Writing Assistant with Feedback Loop", stateFactory.create())
			.addNode("summarizer", node_async(new SummarizerNode(chatClient)))
			.addNode("feedback_classifier", node_async(new SummaryFeedbackClassifierNode(chatClient, "summary")))
			.addNode("reworder", node_async(new RewordingNode(chatClient)))
			.addNode("title_generator", node_async(new TitleGeneratorNode(chatClient)))

			.addEdge(START, "summarizer")
			.addEdge("summarizer", "feedback_classifier")
			.addConditionalEdges("feedback_classifier", edge_async(new FeedbackDispatcher()),
					Map.of("positive", "reworder", "negative", "summarizer"))
			.addEdge("reworder", "title_generator")
			.addEdge("title_generator", END);

		// 添加 PlantUML 打印
		GraphRepresentation representation = graph.getGraph(GraphRepresentation.Type.PLANTUML,
				"writing assistant flow");
		System.out.println("\n=== Writing Assistant UML Flow ===");
		System.out.println(representation.content());
		System.out.println("==================================\n");

		return graph;
	}

}
