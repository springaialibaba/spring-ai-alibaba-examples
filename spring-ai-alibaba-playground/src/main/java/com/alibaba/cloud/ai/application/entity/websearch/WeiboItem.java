package com.alibaba.cloud.ai.application.entity.websearch;

import com.aliyun.tea.NameInMap;
import com.aliyun.tea.TeaModel;

public class WeiboItem extends TeaModel {
	/**
	 * <p>This parameter is required.</p>
	 *
	 * <strong>example:</strong>
	 * <p>weibo_strong</p>
	 */
	@NameInMap("cardType")
	public String cardType;

	/**
	 * <strong>example:</strong>
	 * <p><a href="https://m.weibo.cn/u/7761793874?luicode=20000061&lfid=5024099350350075">https://m.weibo.cn/u/7761793874?luicode=20000061&amp;lfid=5024099350350075</a></p>
	 */
	@NameInMap("homepageLink")
	public String homepageLink;

	/**
	 * <p>This parameter is required.</p>
	 *
	 * <strong>example:</strong>
	 * <p>【小调查：你会买<em>小米SU7</em>吗？】#小米SU7路测覆盖300多城市#4月17日，@小米汽车 发文称SU7道路测试覆盖全国300多个城市，涵盖极寒，极热天气，总里程数高达540万公里，目前仍在进行中。  网页链接</p>
	 */
	@NameInMap("htmlSnippet")
	public String htmlSnippet;

	@NameInMap("images")
	public java.util.List<String> images;

	/**
	 * <p>This parameter is required.</p>
	 *
	 * <strong>example:</strong>
	 * <p><a href="https://m.weibo.cn/detail/5024099350350075?wm=90194_90009">https://m.weibo.cn/detail/5024099350350075?wm=90194_90009</a></p>
	 */
	@NameInMap("link")
	public String link;

	/**
	 * <p>This parameter is required.</p>
	 *
	 * <strong>example:</strong>
	 * <p>1小时前</p>
	 */
	@NameInMap("publishDisplayTime")
	public String publishDisplayTime;

	/**
	 * <strong>example:</strong>
	 * <p>白鹿科技</p>
	 */
	@NameInMap("username")
	public String username;

	public static WeiboItem build(java.util.Map<String, ?> map) throws Exception {
		WeiboItem self = new WeiboItem();
		return TeaModel.build(map, self);
	}

	public WeiboItem setCardType(String cardType) {
		this.cardType = cardType;
		return this;
	}

	public String getCardType() {
		return this.cardType;
	}

	public WeiboItem setHomepageLink(String homepageLink) {
		this.homepageLink = homepageLink;
		return this;
	}

	public String getHomepageLink() {
		return this.homepageLink;
	}

	public WeiboItem setHtmlSnippet(String htmlSnippet) {
		this.htmlSnippet = htmlSnippet;
		return this;
	}

	public String getHtmlSnippet() {
		return this.htmlSnippet;
	}

	public WeiboItem setImages(java.util.List<String> images) {
		this.images = images;
		return this;
	}

	public java.util.List<String> getImages() {
		return this.images;
	}

	public WeiboItem setLink(String link) {
		this.link = link;
		return this;
	}

	public String getLink() {
		return this.link;
	}

	public WeiboItem setPublishDisplayTime(String publishDisplayTime) {
		this.publishDisplayTime = publishDisplayTime;
		return this;
	}

	public String getPublishDisplayTime() {
		return this.publishDisplayTime;
	}

	public WeiboItem setUsername(String username) {
		this.username = username;
		return this;
	}

	public String getUsername() {
		return this.username;
	}

}
