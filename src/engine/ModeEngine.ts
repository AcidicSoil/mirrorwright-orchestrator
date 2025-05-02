import { Logger } from '../utils/Logger';
import Ajv from 'ajv';
import modeSchema from '../schemas/mode.schema.json';

export class ModeEngine {
  private logger: Logger;
  private ajv: Ajv;
  private activeModes: Record<string, any> = {};

  constructor() {
    this.logger = new Logger();
    this.ajv = new Ajv();
    if (!this.ajv.addSchema(modeSchema)) {
      throw new Error('Failed to add mode schema');
    }
  }

  public async initializeModes(modes: any[]) {
    this.logger.info('Initializing modes...');

    // Validate modes against schema
    const validateMode = this.ajv.getSchema('mode');
    if (!validateMode) {
      throw new Error('Mode schema not found');
    }

    modes.forEach(mode => {
      if (!validateMode(mode)) {
        throw new Error(`Invalid mode detected: ${JSON.stringify(mode, null, 2)}`);
      }
    });

    // Store modes
    this.activeModes = modes.reduce((acc: Record<string, any>, mode: any) => {
      acc[mode.id] = mode;
      return acc;
    }, {});

    this.logger.info(`Initialized ${modes.length} modes successfully.`);
  }

  public getActiveModes(): Record<string, any> {
    return { ...this.activeModes };
  }

  public async activateMode(modeId: string, context: Record<string, any>): Promise<void> {
    const mode = this.activeModes[modeId];
    if (!mode) {
      throw new Error(`Mode '${modeId}' not found.`);
    }

    // Apply context modifiers
    const modifiedContext = {
      ...context,
      ...mode.contextModifiers
    };

    this.logger.info(`Activating mode '${modeId}' with context: ${JSON.stringify(modifiedContext, null, 2)}`);

    // TODO: Integrate with mode-specific activation logic
  }

  public async deactivateMode(modeId: string): Promise<void> {
    const mode = this.activeModes[modeId];
    if (!mode) {
      throw new Error(`Mode '${modeId}' not found.`);
    }

    this.logger.info(`Deactivating mode '${modeId}'`);

    // TODO: Integrate with mode-specific deactivation logic

    delete this.activeModes[modeId];
  }
}
