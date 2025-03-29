export type Model = "ollama" | "dashscope" | "user";

export type StreamMessage = {
	model: Model;
	content: string;
	requestId: string;
	startTime: string;
	timeStamp?: string;
	disableMdKit?: boolean;
};

export const createStreamMessage = (
	base: Pick<StreamMessage, "model" | "content" | "requestId"> & {
		startTime?: string;
		timeStamp?: string;
		disableMdKit?: boolean;
	}
): StreamMessage => ({
	startTime: base.startTime ?? Date.now().toString(),
	timeStamp: base.timeStamp ?? Date.now().toString(),
	disableMdKit: base.disableMdKit ?? false,
	...base,
});

export type StreamParams = {
	prompt: string;
	model?: Model[];
	conversationId: string;
	startTime?: string;
};

export type StreamHandlers = {
	onMessage: (model: Model, content: string) => void;
	onError: (error: Error) => void;
	onOpen?: () => void;
	onClose?: () => void;
	onOpenError: (error: Error) => void;
};

export type StreamAction =
	| {
			type: "OPEN_ERROR";
			error: Error;
			conversationId: string;
			requestId: string;
			requestTime: string;
			model: Model;
			models?: Model[];
			prompt: string;
	  }
	| {
			type: "REQUEST_START";
			conversationId: string;
			requestId: string;
			prompt: string;
			requestTime: string;
			model: Model;
			models?: Model[];
	  }
	| {
			type: "MESSAGE_UPDATE";
			conversationId: string;
			requestId: string;
			model: Model;
			content: string;
	  }
	| {
			type: "REQUEST_END";
			conversationId: string;
			requestId: string;
	  }
	| {
			type: "ERROR";
			error: Error;
	  };

export type Conversation = {
	modelMessages: Map<Model, StreamMessage[]>;
	messages: StreamMessage[];
	activeRequests: Map<string, Model>;
};
