export interface Protocol {
  id: string;
  name: string;
  description?: string;
  version: string;
  modes: ModeDefinition[];
  rituals: Record<string, RitualDefinition>;
  metadata?: Record<string, any>;
}

export interface ModeDefinition {
  id: string;
  name: string;
  entryRitual: string;
  exitRitual?: string;
  config?: Record<string, any>;
  allowedTransitions?: string[];
}

export interface RitualDefinition {
  id: string;
  description?: string;
  steps: RitualStep[];
  metadata?: Record<string, any>;
}

export interface RitualStep {
  type: 'prompt' | 'action' | 'pause';
  content: string;
  next?: string;
  conditions?: Condition[];
}

export interface Condition {
  variable: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: any;
}
