import { BuiltinType, FunctionType } from '../ast-node';

import { FunctionSymbol, Symbol } from './symbol';

const BuiltIn: Map<string, Symbol> = new Map();
BuiltIn.set('println', new FunctionSymbol('println', new FunctionType('println', [BuiltinType.Any], BuiltinType.Void)));

export { BuiltIn };
