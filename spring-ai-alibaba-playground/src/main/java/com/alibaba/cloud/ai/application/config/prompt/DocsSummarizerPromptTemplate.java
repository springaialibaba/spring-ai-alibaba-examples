package com.alibaba.cloud.ai.application.config.prompt;

import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Configuration
public class DocsSummarizerPromptTemplate {

	@Bean
	public PromptTemplate summarizerPromptTemplate() {

		return new PromptTemplate(
				"""
				You are an AI assistant specialized in summarizing documents. Your task is to create concise and clear summaries for each section of the provided text, as well as an overall summary for the entire document. Please adhere to the following guidelines:
				
				Section Summaries:
				Summarize each section separately.
				Each section summary should be no longer than 2 paragraphs.
				Highlight the main points and essential information clearly and accurately.
				Overall Summary:
				Provide a summary of the entire document.
				The overall summary should be no longer than 1 paragraph.
				Ensure it encapsulates the core themes and ideas of the document.
				Tone and Clarity:
				Maintain a friendly and polite tone throughout all summaries.
				Use clear and straightforward language to ensure the content is easy to understand.
				Structure:
				Organize the summaries logically, ensuring each section is distinct and coherent.
				Review the summaries to confirm they meet the specified length and clarity requirements.
				"""
		);
	}

}
