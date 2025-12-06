interface Response<T> {
  readonly data?: T;
  readonly error?: any;
}

export default Response;
