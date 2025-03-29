package com.alibaba.cloud.ai.application.entity.websearch;

import java.util.List;
import java.util.Map;

import com.aliyun.tea.NameInMap;
import com.aliyun.tea.TeaModel;

public class GenericSearchResult extends TeaModel {
	@NameInMap("pageItems")
	public List<ScorePageItem> pageItems;
	@NameInMap("queryContext")
	public QueryContext queryContext;
	@NameInMap("requestId")
	public String requestId;
	@NameInMap("sceneItems")
	public List<SceneItem> sceneItems;
	@NameInMap("searchInformation")
	public SearchInformation searchInformation;
	@NameInMap("weiboItems")
	public List<WeiboItem> weiboItems;

	public GenericSearchResult() {
	}

	public static GenericSearchResult build(Map<String, ?> map) throws Exception {
		GenericSearchResult self = new GenericSearchResult();
		return (GenericSearchResult) TeaModel.build(map, self);
	}

	public GenericSearchResult setPageItems(List<ScorePageItem> pageItems) {
		this.pageItems = pageItems;
		return this;
	}

	public List<ScorePageItem> getPageItems() {
		return this.pageItems;
	}

	public GenericSearchResult setQueryContext(QueryContext queryContext) {
		this.queryContext = queryContext;
		return this;
	}

	public QueryContext getQueryContext() {
		return this.queryContext;
	}

	public GenericSearchResult setRequestId(String requestId) {
		this.requestId = requestId;
		return this;
	}

	public String getRequestId() {
		return this.requestId;
	}

	public GenericSearchResult setSceneItems(List<SceneItem> sceneItems) {
		this.sceneItems = sceneItems;
		return this;
	}

	public List<SceneItem> getSceneItems() {
		return this.sceneItems;
	}

	public GenericSearchResult setSearchInformation(SearchInformation searchInformation) {
		this.searchInformation = searchInformation;
		return this;
	}

	public SearchInformation getSearchInformation() {
		return this.searchInformation;
	}

	public GenericSearchResult setWeiboItems(List<WeiboItem> weiboItems) {
		this.weiboItems = weiboItems;
		return this;
	}

	public List<WeiboItem> getWeiboItems() {
		return this.weiboItems;
	}
}
