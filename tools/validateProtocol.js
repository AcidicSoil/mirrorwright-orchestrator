"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
var fs_1 = require("fs");
var path_1 = require("path");
var yaml_1 = __importDefault(require("yaml"));
var ajv_1 = __importDefault(require("ajv"));
var ajv_formats_1 = __importDefault(require("ajv-formats"));
// Load schemas directly from files
var protocolSchema = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../src/schemas/protocol.json'), 'utf-8'));
var modeSchema = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../src/schemas/mode.schema.json'), 'utf-8'));
var ritualSchema = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../src/schemas/ritual.schema.json'), 'utf-8'));
// Create and configure Ajv instance
var ajv = new ajv_1.default({
    allErrors: true,
    verbose: true,
    strictSchema: false,
    strictTypes: false
});
// Add formats
(0, ajv_formats_1.default)(ajv);
// Add schemas
ajv.addSchema(protocolSchema, 'protocol');
ajv.addSchema(modeSchema, 'mode');
ajv.addSchema(ritualSchema, 'ritual');
// Compile validators
var validators = {
    protocol: ajv.compile(protocolSchema),
    mode: ajv.compile(modeSchema),
    ritual: ajv.compile(ritualSchema)
};
/**
 * Validates a YAML file against a schema
 *
 * @param filePath Path to the YAML file to validate
 * @param schemaType Type of schema to validate against (protocol, mode, ritual, or all)
 * @returns Validation result with isValid flag and any errors
 */
function validate(filePath, schemaType) {
    return __awaiter(this, void 0, void 0, function () {
        var content, data, detectedType, validator, valid, errors;
        return __generator(this, function (_a) {
            try {
                // Determine schema type from file path if not provided
                if (!schemaType) {
                    schemaType = determineSchemaTypeFromPath(filePath);
                }
                content = void 0;
                try {
                    content = (0, fs_1.readFileSync)(filePath, 'utf-8');
                }
                catch (error) {
                    return [2 /*return*/, {
                            isValid: false,
                            errors: ["Failed to read file: ".concat(error instanceof Error ? error.message : String(error))]
                        }];
                }
                data = void 0;
                try {
                    data = yaml_1.default.parse(content);
                    // Check if the file is empty or not valid YAML
                    if (!data) {
                        return [2 /*return*/, {
                                isValid: false,
                                errors: ['File is empty or contains invalid YAML']
                            }];
                    }
                }
                catch (error) {
                    return [2 /*return*/, {
                            isValid: false,
                            errors: ["Failed to parse YAML: ".concat(error instanceof Error ? error.message : String(error))]
                        }];
                }
                // Validate against schema
                try {
                    if (schemaType === 'all') {
                        detectedType = determineSchemaTypeFromContent(data);
                        if (!detectedType) {
                            return [2 /*return*/, {
                                    isValid: false,
                                    errors: ['Could not determine schema type from content']
                                }];
                        }
                        schemaType = detectedType;
                    }
                    // Get the appropriate validator
                    if (schemaType === 'all') {
                        return [2 /*return*/, {
                                isValid: false,
                                errors: ['Cannot validate against "all" schema type directly']
                            }];
                    }
                    validator = validators[schemaType];
                    if (!validator) {
                        return [2 /*return*/, {
                                isValid: false,
                                errors: ["No validator found for schema type: ".concat(schemaType)]
                            }];
                    }
                    valid = validator(data);
                    if (!valid) {
                        errors = formatValidationErrors(validator.errors || []);
                        return [2 /*return*/, {
                                isValid: false,
                                errors: errors
                            }];
                    }
                    return [2 /*return*/, {
                            isValid: true,
                            errors: []
                        }];
                }
                catch (error) {
                    return [2 /*return*/, {
                            isValid: false,
                            errors: ["Validation error: ".concat(error instanceof Error ? error.message : String(error))]
                        }];
                }
            }
            catch (error) {
                // Catch any unexpected errors
                return [2 /*return*/, {
                        isValid: false,
                        errors: ["Unexpected error: ".concat(error instanceof Error ? error.message : String(error))]
                    }];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Format validation errors for better readability
 */
function formatValidationErrors(errors) {
    if (!errors || errors.length === 0) {
        return ['Unknown validation error'];
    }
    return errors.map(function (error) {
        var path = error.instancePath || '';
        var message = error.message || 'Invalid value';
        var params = error.params ? " (".concat(JSON.stringify(error.params), ")") : '';
        return "".concat(path, ": ").concat(message).concat(params);
    });
}
/**
 * Attempts to determine the schema type from the file path
 */
function determineSchemaTypeFromPath(filePath) {
    var fileName = (0, path_1.basename)(filePath).toLowerCase();
    if (fileName.includes('protocol')) {
        return 'protocol';
    }
    else if (fileName.includes('mode')) {
        return 'mode';
    }
    else if (fileName.includes('ritual')) {
        return 'ritual';
    }
    // Check parent directory
    var pathParts = filePath.toLowerCase().split('/');
    if (pathParts.includes('protocols')) {
        return 'protocol';
    }
    else if (pathParts.includes('modes')) {
        return 'mode';
    }
    else if (pathParts.includes('rituals')) {
        return 'ritual';
    }
    // Default to protocol if we can't determine
    return 'protocol';
}
/**
 * Attempts to determine the schema type from the content
 */
function determineSchemaTypeFromContent(data) {
    // Protocol typically has modes and rituals
    if (data.modes && data.rituals) {
        return 'protocol';
    }
    // Mode typically has id, name, and entryRitual
    if (data.id && data.name && data.entryRitual) {
        return 'mode';
    }
    // Ritual typically has id and steps
    if (data.id && data.steps) {
        return 'ritual';
    }
    return null;
}
// CLI interface
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, filePath, schemaType, i, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    // Parse arguments
                    for (i = 0; i < args.length; i++) {
                        if (args[i] === '--type' && i + 1 < args.length) {
                            schemaType = args[i + 1];
                            i++; // Skip the next argument
                        }
                        else if (!filePath) {
                            filePath = args[i];
                        }
                    }
                    if (!filePath) {
                        console.error('Please provide a file path');
                        process.exit(1);
                    }
                    return [4 /*yield*/, validate(filePath, schemaType)];
                case 1:
                    result = _a.sent();
                    console.log({
                        isValid: result.isValid,
                        errors: result.errors
                    });
                    if (!result.isValid) {
                        process.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
if (process.argv[1] === __filename) {
    main().catch(function (error) {
        console.error('Error:', error);
        process.exit(1);
    });
}
