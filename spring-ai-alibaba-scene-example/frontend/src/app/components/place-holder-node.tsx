// placeholder component
import { PromptProps, Prompts, Welcome } from "@ant-design/x";
import React from "react";

import {
	CommentOutlined,
	FireOutlined,
	HeartOutlined,
	ReadOutlined,
	SmileOutlined,
} from "@ant-design/icons";
import { type GetProp, Space } from "antd";
const renderTitle = (icon: React.ReactElement, title: string) => (
	<Space align="start">
		{icon}
		<span>{title}</span>
	</Space>
);

const placeHolderNode = ({
	onPromptsItemClick,
}: {
	onPromptsItemClick: (info: { data: PromptProps }) => void;
}) => {
	const placeholderPromptsItems: GetProp<typeof Prompts, "items"> = [
		{
			key: "1",
			label: renderTitle(
				<ReadOutlined style={{ color: "#1890FF" }} />,
				"User Guide"
			),
			description: "",
			children: [
				{
					key: "2-1",
					icon: <HeartOutlined />,
					description: `Build a chatbot using Spring Ai Alibaba?`,
				},
				{
					key: "2-2",
					icon: <SmileOutlined />,
					description: `How to use RAG in Spring Ai Alibaba?`,
				},
				{
					key: "2-3",
					icon: <CommentOutlined />,
					description: `What are best practices for using Spring Ai Alibaba?`,
				},
			],
		},
		{
			key: "2",
			label: renderTitle(<FireOutlined style={{ color: "#FF4D4F" }} />, "Q&A"),
			description: "",
			children: [
				{
					key: "1-1",
					description: `Does Spring AI Alibaba support workflow and multi-agent?`,
				},
				{
					key: "1-2",
					description: `The relation between Spring AI and Spring AI Alibaba?`,
				},
				{
					key: "1-3",
					description: `Where can I contribute?`,
				},
			],
		},
	];

	return (
		<Space direction="vertical" size={16} className="pt-2">
			<Welcome
				variant="borderless"
				icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
				title="Hello, I'm Spring AI Alibaba"
				description="An AI assistant built with Spring AI Alibaba framework, with embedded Spring AI Alibaba..."
			/>
			<Prompts
				title="Do you want?"
				items={placeholderPromptsItems}
				styles={{
					list: {
						width: "100%",
					},
					item: {
						flex: 1,
					},
				}}
				onItemClick={onPromptsItemClick}
			/>
		</Space>
	);
};

export default placeHolderNode;
