package com.alibaba.cloud.ai.application.websearch.rag.prompt;

import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

@Configuration
public class PromptTemplateConfig {

	@Bean
	public PromptTemplate transformerPromptTemplate() {

		return new PromptTemplate(
				"""
				给定一个用户查询，重写用户问题，使得在 {target} 查询时提供更好的结果。
				
				你应该遵循以下规则：
				
				1. 删除任何不相关的信息，并确保查询简洁具体；
				2. 输出必须与用户查询的语言一致；
				3. 保证在大模型的角度更好理解与做出回答。
				
				原始查询：
				{query}
				
				重写之后的查询:
				"""
		);
	}


	@Bean
	public PromptTemplate queryArgumentPromptTemplate() {

		return new PromptTemplate(
				"""
				你将获得一组与问题相关的文档上下文。
				每个文档都以参考编号开头，如 [[x]]，其中 x 是可以重复的数字。
				没有引用的文档将被标记为 [[null]]。
				请使用上下文，并在每个句子的末尾引用上下文（如果适用）。
				上下文信息如下:
				
				---------------------
				{context}
				---------------------
				
				在给定上下文信息且没有先验知识的情况下，生成对用户问题的结构化响应。
				
				在你回答用户问题时，请遵循以下规则：
				
				1. 如果答案不在上下文中，就说你不知道；
				2. 不要提供任何与问题无关的信息，也不要输出任何的重复内容；
				3. 避免使用 “基于上下文...” 或 “The provided information...” 的说法；
				4. 你的答案必须正确、准确，并使用专家般公正和专业的语气撰写；
				5. 回答中适当的文本结构是根据内容的特点来确定的，请在输出中包含副标题以提高可读性；
				6. 生成回复时，先提供明确的结论或中心思想，不需要带有标题；
				7. 确保每个部分都有清晰的副标题，以便用户可以更好地理解和参考你的输出内容；
				8. 如果信息复杂或包含多个部分，请确保每个部分都有适当的标题以创建分层结构；
				9. 请以 [x] 格式引用末尾带有参考编号的句子或部分；
				10. 如果一个句子或章节来自多个上下文，请列出所有适用的引用，例如 [x][y]；
				11. 你的输出答案必须保持美观且严谨的 markdown 格式。
				12. 因为你的输出保持 markdown 格式，请在引用上下文时，以超链接的形式带上参考文档中的链接，方便用户点击查看；
				13. 如果参考文献被标记为 [null]，则不必引用；
				14. 除了代码。具体名称和引文外，你的答案必须用与问题相同的语言编写。
				
				用户问题: {query}
				
				你的回答:
				"""
		);
	}
}
