import { Symbol } from '../visitor';

class StackFrame {
  values: Map<Symbol, any> = new Map();

  retVal: any = undefined;

  getValue(symbol: Symbol): any {
    return this.values.get(symbol);
  }

  setValue(symbol: Symbol, value: any): any {
    this.values.set(symbol, value);
  }
}

export { StackFrame };
