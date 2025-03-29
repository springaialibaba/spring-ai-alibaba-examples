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

import com.alibaba.cloud.ai.application.utils.FilesUtils;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Component
public class TmpFolderConfig implements ApplicationRunner {

	private static final String ImageTmpFolder = "tmp/image";

	private static final String AudioTmpFolder = "tmp/audio";

	private static final Logger logger = LoggerFactory.getLogger(TmpFolderConfig.class);

	@Override
	public void run(ApplicationArguments args) throws Exception {

		logger.info("Init tmp folder");

		FilesUtils.initTmpFolder(System.getProperty("user.dir") + "/" + ImageTmpFolder);
		FilesUtils.initTmpFolder(System.getProperty("user.dir") + "/" +AudioTmpFolder);

		logger.info("Init tmp folder");
	}

	@PreDestroy
	public void destroy() {

		FilesUtils.deleteDirectory(new File(System.getProperty("user.dir") + "/" +ImageTmpFolder));
		FilesUtils.deleteDirectory(new File(System.getProperty("user.dir") + "/" +AudioTmpFolder));
		FilesUtils.deleteDirectory(new File(System.getProperty("user.dir") + "/" +"tmp"));

		logger.info("Delete tmp folder");
	}

}
