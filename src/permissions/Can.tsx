// src/components/Can.tsx
import { ReactNode } from 'react';

import { Subject } from '@casl/ability';
import ability from './permissions';

interface CanProps {
  I: string;             // ação
  a: Subject;            // recurso (feature, model, etc.)
  thisArg?: any;         // objeto (opcional)
  children: ReactNode;
}

export function Can({ I, a, thisArg, children }: CanProps) {
  const isAllowed = ability.can(I, thisArg || a);
  return isAllowed ? <>{children}</> : null;
}
