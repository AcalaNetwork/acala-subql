export type DispatcherHandler<T> = (data?: T) => Promise<void>

export class Dispatcher<DispatchData> {
  private subHandlers: Record<string, DispatcherHandler<DispatchData>[]> = {}

  public regist (key: string, handler: DispatcherHandler<DispatchData>) {
    if (Reflect.has(this.subHandlers, key) && typeof Array.isArray(this.subHandlers[key])) {
      this.subHandlers[key].push(handler)
    } else {
      this.subHandlers[key] = [handler]
    }
  }

  public batchRegist (list: { key: string; handler: DispatcherHandler<DispatchData> }[]) {
    list.forEach((item) => this.regist(item.key, item.handler))
  }

  public async dispatch (key: string, data: DispatchData) {
    const handlers = this.subHandlers[key]

    // check handlers is exists or is an array
    if (!handlers || !Array.isArray(handlers)) return

    return Promise.all(handlers.map((handler) => handler(data)))
  }
}