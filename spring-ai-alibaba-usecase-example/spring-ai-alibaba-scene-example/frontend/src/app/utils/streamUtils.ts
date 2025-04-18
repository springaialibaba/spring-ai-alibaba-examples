import type { StreamMessage, Model } from "@/types/streamTypes";

const updateMessage = (
	prevMessages: StreamMessage[],
	model: Model,
	content: string
): StreamMessage[] => {
	return prevMessages.some((m) => m.model === model)
		? prevMessages.map((message) => {
				return message.model === model
					? {
							...message,
							content: message.content + content,
						}
					: message;
			})
		: prevMessages;
};

export { updateMessage };
