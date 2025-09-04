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
package com.alibaba.cloud.ai.graph.config;

import com.alibaba.cloud.ai.graph.CompileConfig;
import com.alibaba.cloud.ai.graph.CompiledGraph;
import com.alibaba.cloud.ai.graph.GraphRepresentation;
import com.alibaba.cloud.ai.graph.KeyStrategy;
import com.alibaba.cloud.ai.graph.KeyStrategyFactory;
import com.alibaba.cloud.ai.graph.StateGraph;
import com.alibaba.cloud.ai.graph.exception.GraphStateException;
import com.alibaba.cloud.ai.graph.node.ChatNode;
import com.alibaba.cloud.ai.graph.node.SimpleSubGraph;
import com.alibaba.cloud.ai.graph.node.StreamingChatNode;
import com.alibaba.cloud.ai.graph.state.strategy.AppendStrategy;
import com.alibaba.cloud.ai.graph.state.strategy.ReplaceStrategy;
import io.micrometer.observation.ObservationRegistry;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.client.observation.ChatClientObservationConvention;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

import static com.alibaba.cloud.ai.graph.StateGraph.END;
import static com.alibaba.cloud.ai.graph.StateGraph.START;
import static com.alibaba.cloud.ai.graph.action.AsyncNodeAction.node_async;

/**
 * Graph Configuration
 * 
 * Configures the observability graph with various node types and edge types:
 * - Start node: Initial processing
 * - Parallel nodes: Concurrent sentiment and topic analysis
 * - SubGraph node: Internal serial processing
 * - Streaming node: Real-time AI response streaming
 * - Summary node: Result aggregation
 * - End node: Final output formatting
 * 
 * @author sixiyida
 */
@Configuration
public class GraphConfiguration {

    /**
     * Configure ChatClient with logging advisor
     * 
     * @param chatModel the chat model to use
     * @return configured ChatClient
     */
    @Bean
    public ChatClient chatClient(ChatModel chatModel,
        ObjectProvider<ObservationRegistry> observationRegistry,
        ObjectProvider<ChatClientObservationConvention> convention) {

        return ChatClient.builder(chatModel,
                observationRegistry.getIfUnique(() -> ObservationRegistry.NOOP),
                convention.getIfUnique(() -> null))
            .defaultAdvisors(new SimpleLoggerAdvisor())
            .build();
    }

    /**
     * Configure the observability graph
     * 
     * @param chatClient the chat client for AI processing
     * @return configured StateGraph
     * @throws GraphStateException if graph configuration fails
     */
    @Bean
    public StateGraph observabilityGraph(ChatClient chatClient) throws GraphStateException {
        
        // Start node - initial processing
        ChatNode startNode = ChatNode.create(
            "StartNode", 
            "input", 
            "start_output", 
            chatClient, 
            "Please perform initial processing on the input content:"
        );
        
        // Parallel nodes - concurrent processing
        ChatNode parallelNode1 = ChatNode.create(
            "ParallelNode1", 
            "start_output", 
            "parallel_output1", 
            chatClient, 
            "Please perform sentiment analysis on the content:"
        );
        
        ChatNode parallelNode2 = ChatNode.create(
            "ParallelNode2", 
            "start_output", 
            "parallel_output2", 
            chatClient, 
            "Please perform topic analysis on the content:"
        );

        // Summary node - aggregates streaming output
        ChatNode summaryNode = ChatNode.create(
            "SummaryNode", 
            "streaming_output", 
            "summary_output", 
            chatClient, 
            "Please summarize the streaming analysis results:"
        );
        
        // Streaming node - real-time AI response
        StreamingChatNode streamingNode = StreamingChatNode.create(
            "StreamingNode", 
            "final_output", 
            "streaming_output", 
            chatClient, 
            "Please perform detailed analysis on the subgraph results:"
        );
        
        // End node - final output formatting
        ChatNode endNode = ChatNode.create(
            "EndNode", 
            "summary_output", 
            "end_output", 
            chatClient, 
            "Please format the final results for output:"
        );
        
        // Create subgraph
        SimpleSubGraph subGraph = new SimpleSubGraph(chatClient);

        // Define key strategies for state management
        KeyStrategyFactory keyStrategyFactory = () -> {
            Map<String, KeyStrategy> keyStrategyHashMap = new HashMap<>();
            keyStrategyHashMap.put("input", new ReplaceStrategy());
            keyStrategyHashMap.put("start_output", new ReplaceStrategy());
            keyStrategyHashMap.put("parallel_output1", new ReplaceStrategy());
            keyStrategyHashMap.put("parallel_output2", new ReplaceStrategy());
            keyStrategyHashMap.put("final_output", new ReplaceStrategy());
            keyStrategyHashMap.put("streaming_output", new ReplaceStrategy());
            keyStrategyHashMap.put("summary_output", new ReplaceStrategy());
            keyStrategyHashMap.put("end_output", new ReplaceStrategy());
            keyStrategyHashMap.put("logs", new AppendStrategy());
            return keyStrategyHashMap;
        };

        // Build the main graph
        StateGraph graph = new StateGraph(keyStrategyFactory)
        
        // Add nodes
        .addNode("start", node_async(startNode))
        .addNode("parallel1", node_async(parallelNode1))
        .addNode("parallel2", node_async(parallelNode2))
        .addNode("subgraph", subGraph.subGraph())  // Add subgraph
        .addNode("streaming", node_async(streamingNode))  // Add streaming node
        .addNode("summary", node_async(summaryNode))
        .addNode("end", node_async(endNode))
        
        // Serial edge: START -> start
        .addEdge(START, "start")
        
        // Parallel edges: start -> parallel1 and parallel2 (concurrent execution)
        .addEdge("start", "parallel1")
        .addEdge("start", "parallel2")
        
        // Aggregation edges: both parallel nodes complete -> subgraph
        .addEdge("parallel1", "subgraph")
        .addEdge("parallel2", "subgraph")
        
        // Serial edges: subgraph -> streaming -> summary
        .addEdge("subgraph", "streaming")
        .addEdge("streaming", "summary")
        
        // Serial edge: summary -> end
        .addEdge("summary", "end")
        
        // Serial edge: end -> END
        .addEdge("end", END);

        // Print graph structure
        GraphRepresentation representation = graph.getGraph(
            GraphRepresentation.Type.PLANTUML, 
            "Observability Demo"
        );
        
        System.out.println("\n=== Observability Demo Graph ===");
        System.out.println(representation.content());
        System.out.println("================================\n");

        return graph;
    }

    /**
     * Compile the graph with observability configuration
     * 
     * @param observabilityGraph the state graph to compile
     * @param observationCompileConfig the compile configuration
     * @return compiled graph
     * @throws GraphStateException if compilation fails
     */
    @Bean
    public CompiledGraph compiledGraph(StateGraph observabilityGraph, CompileConfig observationCompileConfig) throws GraphStateException {
        return observabilityGraph.compile(observationCompileConfig);
    }
} 