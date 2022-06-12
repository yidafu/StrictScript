class ReturnValue {
  value: any;

  setValue(value: any) {
    this.value = value;
  }

  static isReturnValue(v: any): v is ReturnValue {
    return v instanceof ReturnValue;
  }
}

export { ReturnValue };
