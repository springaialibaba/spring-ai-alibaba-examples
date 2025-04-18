import { useCallback, useReducer } from "react";
import createChartStreamConnection from "@/app/services/streamService";
import {
	Conversation,
	StreamParams,
	StreamAction,
	createStreamMessage,
	Model,
} from "@/types/streamTypes";
import { nanoid } from "nanoid";

type UseMultiModelStreamState = {
	conversations: Map<string, Conversation>;
	error: Error | null;
};

/* --------------------------------- 生成消息的方法 -------------------------------- */

const streamReducer = (
	state: UseMultiModelStreamState,
	action: StreamAction
): UseMultiModelStreamState => {
	switch (action.type) {
		case "REQUEST_START": {
			const conversation = state.conversations.get(action.conversationId) || {
				messages: [],
				activeRequests: new Map(),
				modelMessages: new Map(),
			};

			let newModelMessages = new Map(conversation.modelMessages);

			/* -------------------------------- 分模型的消息列表 -------------------------------- */
			if (!action.models || action.models.length === 0) {
				["ollama", "dashscope"].forEach((model) => {
					newModelMessages = new Map(newModelMessages).set(model, [
						...(newModelMessages.get(model) || []),
						{
							...createStreamMessage({
								model: "user" as Model,
								content: action.prompt,
								requestId: action.requestId,
								startTime: Date.now().toString(),
							}),
						},
					]);
				});
			} else {
				action.models.forEach((model) => {
					newModelMessages = new Map(newModelMessages).set(model, [
						...(newModelMessages.get(model) || []),
						{
							...createStreamMessage({
								model: "user" as Model,
								content: action.prompt,
								requestId: action.requestId,
								timeStamp: Date.now().toString(),
							}),
						},
					]);
				});
			}

			/* --------------------------------- // 聚合消息 -------------------------------- */
			return {
				...state,
				conversations: new Map(state.conversations).set(action.conversationId, {
					...conversation,
					messages: [
						...conversation.messages,
						{
							requestId: action.requestId,
							model: action.model,
							content: action.prompt,
							timeStamp: Date.now().toString(),
							startTime: Date.now().toString(),
						},
					],
					activeRequests: new Map(conversation.activeRequests).set(
						action.requestId,
						action.model
					),
					modelMessages: newModelMessages,
				}),
			};
		}
		case "MESSAGE_UPDATE": {
			const conversation = state.conversations.get(action.conversationId);
			if (!conversation) return state;

			const { model } = action;

			const existingMessage = conversation.messages.find(
				(msg) => msg.requestId === action.requestId && msg.model === model
			);

			const newMessages = existingMessage
				? conversation.messages.map((msg) => {
						return msg.requestId === action.requestId && msg.model === model
							? {
									...msg,
									content: msg.content + action.content,
								}
							: msg;
					})
				: [
						...conversation.messages,
						{
							requestId: action.requestId,
							model: model,
							content: action.content,
							timeStamp: Date.now().toString(),
							startTime: Date.now().toString(),
						},
					];

			const modelMessage = conversation.modelMessages.get(model) || [];
			const existingModelMessage = modelMessage.find(
				(msg) => msg.requestId === action.requestId && msg.model === model
			);

			const newModelMessages = existingModelMessage
				? modelMessage.map((msg) =>
						msg.requestId === action.requestId && msg.model === action.model
							? {
									...msg,
									content: msg.content + action.content,
								}
							: msg
					)
				: [
						...modelMessage,
						{
							requestId: action.requestId,
							model: action.model,
							content: action.content,
							timeStamp: Date.now().toString(),
							startTime: Date.now().toString(),
						},
					];

			return {
				...state,
				conversations: new Map(state.conversations).set(action.conversationId, {
					...conversation,
					messages: newMessages,
					modelMessages: new Map(conversation.modelMessages).set(
						action.model,
						newModelMessages
					),
				}),
			};
		}

		case "REQUEST_END": {
			const conversation = state.conversations.get(action.conversationId);
			if (!conversation) return state;

			const newRequests = new Map(conversation.activeRequests);
			newRequests.delete(action.requestId);

			return {
				...state,
				conversations: new Map(state.conversations).set(action.conversationId, {
					...conversation,
					activeRequests: newRequests,
				}),
			};
		}

		case "OPEN_ERROR": {
			const conversation = state.conversations.get(action.conversationId) || {
				messages: [],
				activeRequests: new Map(),
				modelMessages: new Map(),
			};

			let newModelMessages = new Map(conversation.modelMessages);
			if (!action.models || action.models.length === 0) {
				["ollama", "dashscope"].forEach((model) => {
					// 插入prompt消息和错误消息
					newModelMessages = new Map(newModelMessages).set(model, [
						...(newModelMessages.get(model) || []),
						{
							...createStreamMessage({
								model: "user" as Model,
								content: action.prompt,
								requestId: action.requestId,
								timeStamp: action.requestTime,
								disableMdKit: true,
							}),
						},
						{
							...createStreamMessage({
								model: model as Model,
								content: action.error.message,
								requestId: action.requestId,
								timeStamp: action.requestTime,
								disableMdKit: true,
							}),
						},
					]);
				});
			} else {
				action.models.forEach((model) => {
					newModelMessages = new Map(newModelMessages).set(model, [
						...(newModelMessages.get(model) || []),
						{
							...createStreamMessage({
								model: "user" as Model,
								content: action.prompt,
								requestId: action.requestId,
								timeStamp: action.requestTime,
								disableMdKit: true,
							}),
						},
						{
							...createStreamMessage({
								model: model as Model,
								content: action.error.message,
								requestId: action.requestId,
								timeStamp: action.requestTime,
								disableMdKit: true,
							}),
						},
					]);
				});
			}

			const newMessages = [
				...conversation.messages,
				{
					...createStreamMessage({
						model: "user" as Model,
						content: action.prompt,
						requestId: action.requestId,
						timeStamp: action.requestTime,
						disableMdKit: true,
					}),
				},
				...(action.models || ["ollama", "dashscope"]).map((model) =>
					createStreamMessage({
						model: model as Model,
						content: action.error.message,
						requestId: action.requestId,
						timeStamp: action.requestTime,
						disableMdKit: true,
					})
				),
			];

			return {
				...state,
				conversations: new Map(state.conversations).set(action.conversationId, {
					...conversation,
					messages: [...conversation.messages, ...newMessages],
					modelMessages: newModelMessages,
				}),
				error: action.error,
			};
		}

		case "ERROR": {
			return {
				...state,
				error: action.error,
			};
		}

		default:
			return state;
	}
};

const useMultiModelStream = (conversationId: string) => {
	const [state, dispatch] = useReducer(streamReducer, {
		conversations: new Map(),
		error: null,
	});

	const chatStream = useCallback(
		(streamParams: StreamParams) => {
			if (!streamParams.prompt || !streamParams.conversationId) return;
			const requestId = nanoid();
			const requestTime = Date.now().toString();

			const cleanup = createChartStreamConnection(streamParams, {
				onMessage: (model, content) => {
					dispatch({
						type: "MESSAGE_UPDATE",
						conversationId,
						requestId,
						model,
						content: content,
					});
				},
				onError: (error) => {
					dispatch({
						type: "ERROR",
						error:
							error instanceof Error
								? error
								: new Error(`Stream failed: ${error}`),
					});
				},
				onOpenError: (error) => {
					dispatch({
						type: "OPEN_ERROR",
						error: error,
						conversationId,
						requestId,
						requestTime,
						model: "user",
						prompt: streamParams.prompt,
					});
				},
				onOpen: () => {
					dispatch({
						type: "REQUEST_START",
						conversationId,
						requestId,
						requestTime,
						prompt: streamParams.prompt,
						model: "user",
					});
				},
				onClose: () => {
					dispatch({
						type: "REQUEST_END",
						conversationId,
						requestId,
					});
				},
			});
			return cleanup;
		},
		[conversationId]
	);

	return {
		...state,
		getConversationsState: (conversationId: string) => {
			return {
				messages: state.conversations.get(conversationId)?.messages || [],
				isLoading:
					!!state.conversations.get(conversationId)?.activeRequests.size,
			};
		},
		chatStream,
		error: state.error,
	};
};

export default useMultiModelStream;
