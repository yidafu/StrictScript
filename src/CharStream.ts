class CharStream {
  data: string;

  position = 0;

  line = 1;

  column = 0;

  constructor(data: string) {
    this.data  = data;
  }

  peek(): string {
    return this.data[this.position];
  }

  next(): string {
    const char = this.data[this.position++];
    if (char === '\n') {
      this.line ++;
      this.column = 0;
    } else {
      this.column ++;
    }
    return char;
  }

  eof(): boolean {
    return this.peek() === '';
  }
}

export { CharStream };