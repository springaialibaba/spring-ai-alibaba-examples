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
package com.alibaba.cloud.ai.graph.controller.process;

import com.alibaba.cloud.ai.graph.CompiledGraph;
import com.alibaba.cloud.ai.graph.NodeOutput;
import com.alibaba.cloud.ai.graph.async.AsyncGenerator;
import com.alibaba.cloud.ai.graph.streaming.StreamingOutput;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.Map;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Graph Processor
 * 
 * Responsible for processing graph streaming output and converting NodeOutput to SSE events.
 * Handles both regular node outputs and streaming outputs with proper event formatting.
 * 
 * Features:
 * - Streaming output processing
 * - SSE event formatting
 * - Asynchronous execution
 * - Error handling and logging
 * 
 * @author sixiyida
 */
public class GraphProcess {

    private static final Logger logger = LoggerFactory.getLogger(GraphProcess.class);

    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    /**
     * Constructor for GraphProcess
     * 
     */
    public GraphProcess() {
    }
    
    /**
     * Reactor-friendly streaming output processor.
     *
     * 将 AsyncGenerator<NodeOutput> 转为 Flux<ServerSentEvent<String>>，
     * 保证链路追踪上下文不丢失。
     *
     * @param generator the async generator providing node outputs
     * @return Flux of SSE events
     */
    public Flux<ServerSentEvent<String>> processStream(AsyncGenerator<NodeOutput> generator) {
        return Flux.create(sink -> generator.forEachAsync(output -> {
            try {
                logger.info("Processing node output: {}", output);
                String nodeName = output.node();
                String content;
                
                if (output instanceof StreamingOutput streamingOutput) {
                    // Handle streaming output
                    content = JSON.toJSONString(Map.of(
                            "type", "streaming",
                            "node", nodeName,
                            "chunk", streamingOutput.chunk(),
                            "timestamp", System.currentTimeMillis()
                    ));
                } else {
                    // Handle regular output
                    JSONObject nodeOutput = new JSONObject();
                    nodeOutput.put("type", "node_output");
                    nodeOutput.put("node", nodeName);
                    nodeOutput.put("data", output.state().data());
                    nodeOutput.put("timestamp", System.currentTimeMillis());
                    content = JSON.toJSONString(nodeOutput);
                }
                
                // Emit SSE event
                sink.next(ServerSentEvent.builder(content)
                        .event("node_output")
                        .id(nodeName + "_" + System.currentTimeMillis())
                        .build());
                
            } catch (Exception e) {
                logger.error("Error occurred while processing node output", e);
                sink.error(e);
            }
        }).thenAccept(v -> {
            // Normal completion
            logger.info("Graph processing completed");
            sink.next(ServerSentEvent.builder("{\"type\":\"completed\",\"message\":\"Graph processing completed\"}")
                    .event("completed")
                    .build());
            sink.complete();
        }).exceptionally(e -> {
            logger.error("Exception occurred during graph processing", e);
            sink.next(ServerSentEvent.builder("{\"type\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                    .event("error")
                    .build());
            sink.error(e);
            return null;
        }));
    }
} 