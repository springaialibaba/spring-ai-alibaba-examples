package com.alibaba.cloud.ai.application.websearch.data;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.alibaba.cloud.ai.application.exception.SAAAppException;
import com.alibaba.cloud.ai.application.websearch.entity.GenericSearchResult;
import com.alibaba.cloud.ai.application.websearch.entity.ScorePageItem;

import org.springframework.ai.document.Document;
import org.springframework.ai.model.Media;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeType;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 *
 * Data Cleansing: Filters out useless data and converts it into Spring AI's Document objects
 */

@Component
public class DataClean {

	public List<Document> getData(GenericSearchResult respData) {

		List<Document> documents = new ArrayList<>();

		Map<String, Object> metadata = getQueryMetadata(respData);

		for (ScorePageItem pageItem : respData.getPageItems()) {

			Map<String, Object> pageItemMetadata = getPageItemMetadata(pageItem);
			Double score = getScore(pageItem);
			String text = getText(pageItem);

			if (Objects.equals("", text)) {

				Media media = getMedia(pageItem);
				Document document = new Document.Builder()
						.metadata(metadata)
						.metadata(pageItemMetadata)
						.media(media)
						.score(score)
						.build();

				documents.add(document);
				break;
			}

			Document document = new Document.Builder()
					.metadata(metadata)
					.metadata(pageItemMetadata)
					.text(text)
					.score(score)
					.build();

			documents.add(document);
		}

		return documents;
	}

	private Double getScore(ScorePageItem pageItem) {

		return pageItem.getScore();
	}

	private Map<String, Object> getQueryMetadata(GenericSearchResult respData) {

		HashMap<String, Object> docsMetadata = new HashMap<>();

		if (Objects.nonNull(respData.getQueryContext())) {
			docsMetadata.put("query", respData.getQueryContext().getOriginalQuery().getQuery());

			if (Objects.nonNull(respData.getQueryContext().getOriginalQuery().getTimeRange())) {
				docsMetadata.put("timeRange", respData.getQueryContext().getOriginalQuery().getTimeRange());
			}

			if (Objects.nonNull(respData.getQueryContext().getOriginalQuery().getTimeRange())) {
				docsMetadata.put("filters", respData.getQueryContext().getOriginalQuery().getTimeRange());
			}
		}

		return docsMetadata;
	}

	private Map<String, Object> getPageItemMetadata(ScorePageItem pageItem) {

		HashMap<String, Object> pageItemMetadata = new HashMap<>();

		if (Objects.nonNull(pageItem)) {

			if (Objects.nonNull(pageItem.getHostname())) {
				pageItemMetadata.put("hostname", pageItem.getHostname());
			}

			if (Objects.nonNull(pageItem.getHtmlSnippet())) {
				pageItemMetadata.put("htmlSnippet", pageItem.getHtmlSnippet());
			}

			if (Objects.nonNull(pageItem.getTitle())) {
				pageItemMetadata.put("title", pageItem.getTitle());
			}

			if (Objects.nonNull(pageItem.getMarkdownText())) {
				pageItemMetadata.put("markdownText", pageItem.getMarkdownText());
			}

			if (Objects.nonNull(pageItem.getLink())) {
				pageItemMetadata.put("link", pageItem.getLink());
			}
		}

		return pageItemMetadata;
	}

	private Media getMedia(ScorePageItem pageItem) {

		String mime = pageItem.getMime();
		URL url;
		try {
			url = new URL(pageItem.getLink()).toURI().toURL();
		}
		catch (Exception e) {
			throw new SAAAppException("Invalid URL: " + pageItem.getLink());
		}

		return new Media(MimeType.valueOf(mime), url);
	}

	private String getText(ScorePageItem pageItem) {

		if (Objects.nonNull(pageItem.getMainText())) {

			String mainText = pageItem.getMainText();

			mainText = mainText.replaceAll("<[^>]+>", "");
			mainText = mainText.replaceAll("[\\n\\t\\r]+", " ");
			mainText = mainText.replaceAll("[\\u200B-\\u200D\\uFEFF]", "");

			return mainText.trim();
		}

		return "";
	}

	public List<Document> limitResults(List<Document> documents, int minResults) {

		int limit = Math.min(documents.size(), minResults);

		return documents.subList(0, limit);
	}

}
