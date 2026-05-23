type FlowCallback = (payload?: any) => void;

const flowCallbacks = new Map<string, FlowCallback>();

export function createFlowCallback(callback: FlowCallback): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  flowCallbacks.set(id, callback);
  return id;
}

export function invokeFlowCallback(id: string | undefined, payload?: any): void {
  if (!id) return;
  const callback = flowCallbacks.get(id);
  if (callback) {
    callback(payload);
  }
}
