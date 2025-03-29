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

package com.alibaba.cloud.ai.application.utils;

import java.io.File;
import java.io.IOException;

import com.alibaba.cloud.ai.application.exception.SAAAppException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.multipart.MultipartFile;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

public final class FilesUtils {

	private static final Logger logger = LoggerFactory.getLogger(FilesUtils.class);

	private FilesUtils() {
	}

	/**
	 * Init image and audio tmp folder
	 */
	public static void initTmpFolder(String path) {

		if (path == null || path.isEmpty()) {

			throw new SAAAppException("path is null or empty");
		}

		File tmpFolder = new File(path);
		if (!tmpFolder.exists()) {
			tmpFolder.mkdirs();
		}

		logger.info("Init tmp folder: {}", tmpFolder.getAbsolutePath());
	}

	public static void deleteDirectory(File directory) {

		if (directory.exists()) {
			File[] files = directory.listFiles();
			if (files != null) {
				for (File file : files) {
					if (file.isDirectory()) {
						deleteDirectory(file);
					} else {
						file.delete();
					}
				}
			}

			directory.delete();
		}
	}

	/**
	 * save file to tmp folder
	 */
	public static void saveTempImage(MultipartFile file, String path) throws IOException {

		file.transferTo(new File(path));
	}

}
