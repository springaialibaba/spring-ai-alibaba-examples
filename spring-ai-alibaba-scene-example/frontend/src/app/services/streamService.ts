import { Model, StreamHandlers, StreamParams } from "@/types/streamTypes";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const models: Model[] = ["ollama", "dashscope"];

const isValidModel = (model: string): model is Model => {
	return models.includes(model as Model);
};

const createChartStreamConnection = (
	params: StreamParams,
	handlers: StreamHandlers
) => {
	const ctrl = new AbortController();

	fetchEventSource("/api/stream/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept-Encoding": "identity",
		},
		body: JSON.stringify(params),
		signal: ctrl.signal,
		onopen: async (res) => {
			if (res.status === 200) {
				handlers.onOpen?.();
			} else {
				handlers.onOpenError(new Error(`Server error: ${res.status}`));
			}
		},
		onmessage: (event) => {
			if (isValidModel(event.event)) {
				handlers.onMessage(event.event, event.data);
			}
		},
		onerror: (error) => handlers.onError(error),
		onclose: () => handlers.onClose?.(),
	});

	return () => ctrl.abort();
};

export default createChartStreamConnection;
