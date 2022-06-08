import { InputStream } from "./InputStream";


class Position {
   begin: number;
   end: number;
   line: number;
   column: number;

  constructor(begin: number, end: number, line: number, column: number) {
     this.begin = begin;
     this.end = end;
     this.line = line;
     this.column = column;
   }

   renewEnd(stream: InputStream) {
    this.end = stream.position + 1;
   }

   toString() {
     return `(line:${this.line}, column:${this.column}, position:${this.begin})`;
   }
}


export { Position }