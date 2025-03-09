package com.alibaba.cloud.ai.application.websearch.rag.join;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ai.document.Document;
import org.springframework.ai.rag.Query;
import org.springframework.ai.rag.retrieval.join.DocumentJoiner;
import org.springframework.lang.Nullable;
import org.springframework.util.Assert;

/**
 * @author yuluo
 * @author <a href="mailto:yuluo08290126@gmail.com">yuluo</a>
 */

public class ConcatenationDocumentJoiner implements DocumentJoiner {

	private static final Logger logger = LoggerFactory.getLogger(ConcatenationDocumentJoiner.class);

	@NotNull
	@Override
	public List<Document> join(
			@Nullable Map<Query, List<List<Document>>> documentsForQuery
	) {

		Assert.notNull(documentsForQuery, "documentsForQuery cannot be null");
		Assert.noNullElements(documentsForQuery.keySet(), "documentsForQuery cannot contain null keys");
		Assert.noNullElements(documentsForQuery.values(), "documentsForQuery cannot contain null values");
		logger.debug("Joining documents by concatenation");

		Map<Query, List<List<Document>>> selectDocuments = selectDocuments(documentsForQuery, 10);

		Set<String> seen = new HashSet<>();

		return selectDocuments.values().stream()
				// Flatten List<List<Documents>> to Stream<List<Documents>.
				.flatMap(List::stream)
				// Flatten Stream<List<Documents> to Stream<Documents>.
				.flatMap(List::stream)
				.filter(doc -> {
					List<String> keys = extractKeys(doc);
					for (String key : keys) {
						if (!seen.add(key)) {
							logger.info("Duplicate document metadata: {}",doc.getMetadata());
							// Duplicate keys found.
							return false;
						}
					}
					// All keys are unique.
					return true;
				})
				.collect(Collectors.toList());
	}

	private Map<Query, List<List<Document>>> selectDocuments(
			Map<Query, List<List<Document>>> documentsForQuery,
			int totalDocuments
	) {

		Map<Query, List<List<Document>>> selectDocumentsForQuery = new HashMap<>();

		int numberOfQueries = documentsForQuery.size();

		if (Objects.equals(0, numberOfQueries)) {

			return selectDocumentsForQuery;
		}

		int baseCount = totalDocuments / numberOfQueries;
		int remainder = totalDocuments % numberOfQueries;

		// To ensure consistent distribution. sort the keys (optional)
		List<Query> sortedQueries = new ArrayList<>(documentsForQuery.keySet());
		// Other sort
		// sortedQueries.sort(Comparator.comparing(Query::getSomeProperty));
		Iterator<Query> iterator = sortedQueries.iterator();

		for (int i = 0; i < numberOfQueries; i ++) {
			Query query = sortedQueries.get(i);
			int documentToSelect = baseCount + (i < remainder ? 1 : 0);
			List<List<Document>> originalDocuments = documentsForQuery.get(query);
			List<List<Document>> selectedNestLists = new ArrayList<>();

			int remainingDocuments = documentToSelect;
			for (List<Document> documentList : originalDocuments) {
				if (remainingDocuments <= 0) {
					break;
				}

				List<Document> selectSubList = new ArrayList<>();
				for (Document docs : documentList) {
					if (remainingDocuments <= 0) {
						break;
					}

					selectSubList.add(docs);
					remainingDocuments --;
				}

				if (!selectSubList.isEmpty()) {
					selectedNestLists.add(selectSubList);
				}
			}

			selectDocumentsForQuery.put(query, selectedNestLists);
		}

		return selectDocumentsForQuery;
	}

	private List<String> extractKeys(Document document) {

		List<String> keys = new ArrayList<>();

		if (Objects.nonNull(document)) {
			keys.add(document.getId());
		}

		if (Objects.nonNull(document.getMetadata())) {
			Object src = document.getMetadata().get("source");
			if (src instanceof String) {
				keys.add("SOURCE:" + src);
			}

			Object fn = document.getMetadata().get("file_name");
			if (fn instanceof String) {
				keys.add("FILE_NAME:" + fn);
			}
		}

		return keys;
	}

}
