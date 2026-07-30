export default class TaskResult {
  private isSuccess: boolean;
  private message: string;
  private value: any;

  constructor() {
    this.isSuccess = false;
    this.message = '';
    this.value = null;
  }

  setSuccess(value: any): this {
    this.isSuccess = true;
    this.value = value;
    return this;
  }

  setUnsuccess(message: string): this {
    this.isSuccess = false;
    this.message = message;
    return this;
  }

  get result() {
    return {
      isSuccess: this.isSuccess,
      message: this.message,
      value: this.value,
    };
  }
}
