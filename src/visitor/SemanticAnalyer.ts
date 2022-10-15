import { Program } from '../ast-node';

import { Enter } from './Enter';
import { LeftValueAttributor } from './LeftValueAttributor';
import { RefResolver } from './RefResolver';
import { Scope } from './Scope';
import { TypeResolver } from './TypeResolver';
import { ScopeDumper } from './dumper/ScopeDumper';

export class SemanticAnalyer {
  execute(program: Program) {
    const processers = [
      new TypeResolver(),
      new Enter(),
      new ScopeDumper(),
      new RefResolver(),
      // new TypeChecker(),
      // new AssignAnalyzer(),
      new LeftValueAttributor(),
    ];

    for (const processer of processers) {
      processer.visitProgram(program);
    }
  }
}
