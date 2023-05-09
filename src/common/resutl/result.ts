type ResultOptions<T> = {
  success: boolean;
  data?: T;
  message: string;
};
export class Result<T> {
  data: T;
  message: string;
  success: boolean;
  constructor({ success, data, message }: ResultOptions<T>) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
