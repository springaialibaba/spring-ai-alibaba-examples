/*
 * Copyright 2025 the original author or authors.
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
 */

package com.alibaba.example.graph.node;

import com.alibaba.cloud.ai.graph.OverAllState;
import com.alibaba.cloud.ai.graph.action.NodeAction;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Render the template in AnswerNodeData into the final answer string.
 * <p>
 * Support using {{varName}} placeholders in templates to read and replace the
 * corresponding values from the global state.
 * </p>
 * todo: should add to saa
 */
public class AnswerNode implements NodeAction {

	public static final String OUTPUT_KEY = "answer";

	private final String answerTemplate;

	private AnswerNode(String answerTemplate) {
		this.answerTemplate = answerTemplate;
	}

	@Override
	public Map<String, Object> apply(OverAllState state) {
		String rendered = this.answerTemplate;
		Pattern p = Pattern.compile("\\{\\{(.+?)}}");
		Matcher m = p.matcher(rendered);
		StringBuffer sb = new StringBuffer();
		while (m.find()) {
			String var = m.group(1).trim();
			String val = Optional.ofNullable(state.value(var).orElse("")).map(Object::toString).orElse("");
			m.appendReplacement(sb, Matcher.quoteReplacement(val));
		}
		m.appendTail(sb);

		Map<String, Object> out = new HashMap<>();
		out.put(OUTPUT_KEY, sb.toString());
		return out;
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {

		private String answerTemplate;

		public Builder answer(String tpl) {
			this.answerTemplate = tpl;
			return this;
		}

		public AnswerNode build() {
			return new AnswerNode(this.answerTemplate);
		}

	}

}
