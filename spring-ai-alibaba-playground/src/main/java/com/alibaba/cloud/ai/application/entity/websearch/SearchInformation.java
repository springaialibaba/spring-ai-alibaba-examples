package com.alibaba.cloud.ai.application.entity.websearch;

import com.aliyun.tea.NameInMap;
import com.aliyun.tea.TeaModel;

public class SearchInformation extends TeaModel {
	
	@NameInMap("searchTime")
	public Long searchTime;

	@NameInMap("total")
	public Long total;

	public static SearchInformation build(java.util.Map<String, ?> map) throws Exception {
		SearchInformation self = new SearchInformation();
		return TeaModel.build(map, self);
	}

	public SearchInformation setSearchTime(Long searchTime) {
		this.searchTime = searchTime;
		return this;
	}

	public Long getSearchTime() {
		return this.searchTime;
	}

	public SearchInformation setTotal(Long total) {
		this.total = total;
		return this;
	}

	public Long getTotal() {
		return this.total;
	}

}
