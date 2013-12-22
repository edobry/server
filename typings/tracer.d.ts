declare enum MessageType {
	Info,
	Error
}

interface Tracer {
	trace(message: string, type: MessageType): void;
}