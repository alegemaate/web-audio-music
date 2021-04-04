export class SetInterval {
  private fun: (elapsed: number) => void;

  private stopped: boolean;

  public constructor(fun: (elapsed: number) => void) {
    this.fun = fun;
    this.stopped = false;
  }

  public start() {
    requestAnimationFrame(this.callback.bind(this, Date.now()));
  }

  public stop() {
    this.stopped = true;
  }

  private callback(startTime: number) {
    const elapsed = Date.now() - startTime;
    this.fun(elapsed);
    if (!this.stopped) {
      requestAnimationFrame(this.callback.bind(this, startTime));
    }
  }
}
