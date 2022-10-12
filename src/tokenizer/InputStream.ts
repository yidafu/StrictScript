import { Position } from './Position';

class InputStream {
  data: string;

  position = 0;

  line = 1;

  column = 0;

  constructor(data: string) {
    this.data = data;
  }

  peek(): string {
    return this.data.charAt(this.position);
  }

  next(): string {
    const char = this.data.charAt(this.position++);
    if (char === '\n') {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }
    return char;
  }

  eof(): boolean {
    return this.peek() === '';
  }

  getPosition(): Position {
    return new Position(this.position + 1, this.position + 1, this.line, this.column);
  }
}

export { InputStream };
