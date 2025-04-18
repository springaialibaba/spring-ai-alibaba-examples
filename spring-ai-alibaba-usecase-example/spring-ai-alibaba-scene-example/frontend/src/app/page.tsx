"use client"; // [!code focus]
import {
	Attachments,
	Bubble,
	BubbleProps,
	Conversations,
	Prompts,
	Sender,
} from "@ant-design/x";
import React, { useEffect, useMemo, useState } from "react";
import markdownit from "markdown-it";

import {
	PaperClipOutlined,
	PlusOutlined,
	UserAddOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Badge,
	Button,
	Flex,
	type GetProp,
	Layout,
	Tooltip,
	Typography,
} from "antd";
import { PlaceHolderNode, LogoNode, FriendlyLinkBar } from "./components";
import { Conversation, Model, StreamMessage } from "@/types/streamTypes";
import useMultiModelChatStream from "./hooks/useMultiModelChatStream";

const { Sider } = Layout;
const md = markdownit({ html: true, breaks: true });

const defaultConversationsItems = [
	{
		key: Date.now().toString(),
		label: "Conversation",
	},
];

const fooAvatar: React.CSSProperties = {
	color: "#f56a00",
	backgroundColor: "#fde3cf",
};

const barAvatar: React.CSSProperties = {
	color: "#fff",
	backgroundColor: "#87d068",
};

const roles: GetProp<typeof Bubble.List, "roles"> = {
	user: {
		placement: "end",
		avatar: {
			style: fooAvatar,
			icon: <UserOutlined />,
		},
		header: "user",
		styles: {
			content: {
				maxWidth: 600,
				borderRadius: 16,
			},
		},
	},
	dashscope: {
		placement: "start",
		header: "dashscope",
		avatar: {
			style: barAvatar,
			icon: <UserAddOutlined />,
		},
		styles: {
			content: {
				maxWidth: 600,
				borderRadius: 16,
			},
		},
	},
	ollama: {
		placement: "start",
		header: "ollama",
		avatar: {
			style: barAvatar,
			icon: <UserAddOutlined />,
		},
		styles: {
			content: {
				maxWidth: 600,
				borderRadius: 16,
			},
		},
	},
};

const renderMarkdown: BubbleProps["messageRender"] = (content) => (
	<Typography>
		{/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
		<div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
	</Typography>
);

const Independent: React.FC = () => {
	// ==================== State ====================
	const [sideCollapsed, setSideCollapsed] = React.useState(false);
	const [selectModels, setSelectModels] = useState([
		"ollama",
		"dashscope",
	] as Model[]);
	const [headerOpen, setHeaderOpen] = React.useState(false);
	const [content, setContent] = React.useState("");
	const [conversationsItems, setConversationsItems] = React.useState(
		defaultConversationsItems
	);
	const [sizes, setSizes] = React.useState<(number | string)[]>(["50%", "50%"]);

	// ================================= 会话的 key ===================================
	const [activeKey, setActiveKey] = React.useState(
		defaultConversationsItems[0].key
	);

	// 附件
	const [attachedFiles, setAttachedFiles] = React.useState<
		GetProp<typeof Attachments, "items">
	>([]);

	// 获取会话请求的接口
	const { conversations, getConversationsState, chatStream, error } =
		useMultiModelChatStream(activeKey);

	// 触发 prompt 请求
	const onSubmit = (nextContent: string) => {
		if (!nextContent) return;
		setContent(nextContent); // 触发流式请求
		chatStream({
			prompt: content,
			conversationId: activeKey,
		});
		setContent("");
	};

	// TODO 上一个请求没结束不能触发
	const onPromptsItemClick: GetProp<typeof Prompts, "onItemClick"> = (info) => {
		setContent(info.data.description as string);
		chatStream({
			prompt: info.data.description as string,
			conversationId: activeKey,
		});
		setContent("");
	};

	// TODO 会话返回过程中要切换、新增会话怎么办
	const onAddConversation = () => {
		setConversationsItems([
			...conversationsItems,
			{
				key: `${conversationsItems.length}`,
				label: `New Conversation ${conversationsItems.length}`,
			},
		]);
		setActiveKey(`${conversationsItems.length}`);
	};

	const onConversationClick: GetProp<typeof Conversations, "onActiveChange"> = (
		key
	) => {
		setActiveKey(key);
	};

	const attachmentsNode = (
		<Badge dot={attachedFiles.length > 0 && !headerOpen}>
			<Tooltip title="暂不支持">
				<Button
					type="text"
					disabled
					icon={<PaperClipOutlined />}
					onClick={() => setHeaderOpen(!headerOpen)}
				/>
			</Tooltip>
		</Badge>
	);

	// ==================== 消息合并 ====================
	const mergedMessages = useMemo(() => {
		const conversation = conversations.get(activeKey);
		if (!conversation)
			return [
				{
					content: <PlaceHolderNode onPromptsItemClick={onPromptsItemClick} />,
					variant: "borderless" as const,
				},
			];
		const { messages } = conversation as Conversation;

		return messages.length
			? messages.map((message) => {
					return {
						messageRender: renderMarkdown,
						key: message.requestId + message.model,
						role: message.model,
						content: message.content,
					};
				})
			: [
					{
						content: (
							<PlaceHolderNode onPromptsItemClick={onPromptsItemClick} />
						),

						variant: "borderless" as const,
					},
				];
	}, [conversations, activeKey]);

	const dividedMessages = useMemo((): Map<Model, StreamMessage[]> => {
		const conversation = conversations.get(activeKey);
		if (!conversation) {
			const mockModelMessages = new Map();
			selectModels.forEach((model) => {
				mockModelMessages.set(model, [
					{
						disableMdKit: true,
						content: (
							<PlaceHolderNode onPromptsItemClick={onPromptsItemClick} />
						),
						model,
						variant: "borderless" as const,
					},
				]);
			});
			return mockModelMessages;
		}
		const { modelMessages } = conversation as Conversation;

		return modelMessages;
	}, [conversations, activeKey]);

	// ==================== 错误处理 ====================
	useEffect(() => {
		if (error) {
			console.error("流式请求错误:", error);
			// TODO 在这里添加 Ant Design 的通知提示
		}
	}, [error]);

	// ==================== Render =================
	return (
		<div className="w-full min-w-[1000px] h-screen min-h-[722px] rounded flex bg-white font-[AlibabaPuHuiTi,system-ui]">
			<Sider
				style={{
					background: "#fafafa",
				}}
				width={280}
				theme="dark"
				collapsedWidth="120"
				collapsible
				onCollapse={(collapsed, type) => {
					setSideCollapsed(collapsed);
				}}
				collapsed={sideCollapsed}>
				{/* 🌟 Logo */}
				<LogoNode showTitle={!sideCollapsed} />
				{/* 🌟 添加会话 */}
				<Button
					onClick={onAddConversation}
					style={{
						border: "1px solid #1677ff34",
						width: "calc(100% - 24px)",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
					icon={<PlusOutlined />}
					className={` text-ellipsis bg-[#1677ff0f]  border border-[#1677ff0f] mx-3 mb-6`}>
					{
						<span className="text-ellipsis w-[100%] overflow-hidden whitespace-nowrap">
							{sideCollapsed ? "New" : "Add Conversation"}
						</span>
					}
				</Button>
				{/* 🌟 会话管理 */}
				<Conversations
					items={conversationsItems}
					className="px-3 flex-1 overflow-y-auto"
					activeKey={activeKey}
					onActiveChange={onConversationClick}
				/>
			</Sider>

			<div className="h-full w-ful   min-w-[600px] mx-auto box-border flex flex-col p-2 gap-4 relative">
				<FriendlyLinkBar />
				{/* 🌟 消息列表 */}
				{/* <Bubble.List items={mergedMessages} roles={roles} className="flex-1" /> */}

				<div
					style={{
						height: "calc(100vh - 130px)",
					}}>
					<Flex
						vertical={false}
						gap="middle"
						style={{
							height: "100%",
							overflowY: "hidden",
						}}>
						{selectModels.map((model) => {
							return (
								<Bubble.List
									key={model}
									items={(dividedMessages.get(model) || []).map((message) => {
										return message?.disableMdKit
											? {
													key: message.requestId + message.model,
													role: message.model,
													content: message.content,
												}
											: {
													messageRender: renderMarkdown,
													key: message.requestId + message.model,
													role: message.model,
													content: message.content,
												};
									})}
									roles={roles}
									className="flex-1"
									style={{
										height: "100%",
										minWidth: "700px",
										overflowY: "scroll",
										padding: "0 2px",
									}}
								/>
							);
						})}
					</Flex>
				</div>
				{/* 🌟 输入框 */}
				<div className=" absolute bottom-2 w-full">
					<Sender
						value={content}
						onSubmit={onSubmit}
						onChange={setContent}
						prefix={attachmentsNode}
						loading={getConversationsState(activeKey).isLoading}
						className="shadow-md"
					/>
				</div>
			</div>
		</div>
	);
};

export default Independent;
