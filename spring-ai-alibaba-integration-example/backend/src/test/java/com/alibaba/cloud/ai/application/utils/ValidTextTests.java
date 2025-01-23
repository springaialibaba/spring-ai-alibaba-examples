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

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

class ValidTextTests {

	@Test
	public void testValidInput_withLettersAndNumbers() {
		assertTrue(ValidText.isValidate("Hello123"));
	}

	@Test
	public void testValidInput_withPunctuation() {
		assertTrue(ValidText.isValidate("Hello, world! How are you?"));
	}

	@Test
	public void testValidInput_withSpaces() {
		assertTrue(ValidText.isValidate("This is a test."));
	}

	@Test
	public void testValidInput_withSpecialCharacters() {
		assertFalse(ValidText.isValidate("Invalid@Input!"));
	}

	@Test
	public void testValidInput_withEmptyString() {
		assertFalse(ValidText.isValidate(""));
	}

	@Test
	public void testValidInput_withNull() {
		assertFalse(ValidText.isValidate(null));
	}

	@Test
	public void testValidInput_withOnlySpaces() {
		assertTrue(ValidText.isValidate("   ")); 
	}

}
