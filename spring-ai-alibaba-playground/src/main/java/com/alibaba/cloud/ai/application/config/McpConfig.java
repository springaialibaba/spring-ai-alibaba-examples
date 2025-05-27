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
package com.alibaba.cloud.ai.application.config;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.Ordered;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

/**
 * @author brianxiadong
 *         MCP配置处理类
 *         在应用启动时处理mcp-servers-config.json中的路径配置
 */
@Component
public class McpConfig implements ApplicationListener<ApplicationEnvironmentPreparedEvent>, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(McpConfig.class);
    private static final String MCP_CONFIG_FILE = "mcp-servers-config.json";
    private static final String MCP_LIBS_DIR = "mcp-libs";

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        try {
            // 获取配置文件
            File configFile = ResourceUtils.getFile("classpath:" + MCP_CONFIG_FILE);
            logger.debug("Config file path: {}", configFile.getAbsolutePath());

            // 获取 mcp-libs 目录的绝对路径
            ClassPathResource mcpLibsResource = new ClassPathResource(MCP_LIBS_DIR);
            String mcpLibsPath = mcpLibsResource.getFile().getAbsolutePath();
            logger.debug("MCP libs directory path: {}", mcpLibsPath);

            // 读取配置文件
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(configFile);
            logger.debug("Original config content: {}", mapper.writeValueAsString(rootNode));

            // 处理所有服务配置
            JsonNode mcpServers = rootNode.get("mcpServers");
            if (mcpServers.isObject()) {
                Iterator<String> fieldNames = mcpServers.fieldNames();
                while (fieldNames.hasNext()) {
                    String serverName = fieldNames.next();
                    JsonNode serverConfig = mcpServers.get(serverName);
                    logger.info("Processing server: {}", serverName);

                    // 获取args数组
                    JsonNode args = serverConfig.get("args");
                    if (args.isArray()) {
                        ArrayNode argsArray = (ArrayNode) args;
                        for (int i = 0; i < argsArray.size(); i++) {
                            String arg = argsArray.get(i).asText();
                            if (arg.contains(".jar")) {
                                // 获取jar包名称
                                String jarName = new File(arg).getName();
                                logger.debug("Found JAR reference: {}", jarName);

                                // 构建新的绝对路径
                                File jarFile = new File(mcpLibsPath, jarName);
                                logger.debug("Absolute JAR path: {}", jarFile.getAbsolutePath());

                                if (!jarFile.exists()) {
                                    logger.error("JAR file not found: {}", jarFile.getAbsolutePath());
                                    throw new RuntimeException("JAR file not found: " + jarFile.getAbsolutePath());
                                }

                                // 更新路径
                                argsArray.set(i, mapper.valueToTree(jarFile.getAbsolutePath()));
                                logger.debug("Updated JAR path in config: {}", jarFile.getAbsolutePath());
                            }
                        }
                    }
                }
            }

            // 直接更新源配置文件
            mapper.writerWithDefaultPrettyPrinter().writeValue(configFile, rootNode);
            logger.debug("Updated source config file with absolute paths");

        } catch (IOException e) {
            logger.error("Failed to process MCP configuration", e);
            throw new RuntimeException("Failed to process MCP configuration: " + e.getMessage(), e);
        }
    }

}
