import * as jspb from 'google-protobuf';
import CatalogSchemaMinio from 'libraries/catalogs/minio';
import CatalogSchemaMongoDB from 'libraries/catalogs/mongodb';
import CatalogSchemaMySQL from 'libraries/catalogs/mysql';
import CatalogSchemaPostgreSQL from 'libraries/catalogs/postgres';
import CatalogSchemaRedis from 'libraries/catalogs/redis';
import {
  CATALOG_MINIO,
  CATALOG_MONGODB,
  CATALOG_MYSQL,
  CATALOG_POSTGRES,
  CATALOG_REDIS,
  CatalogTypes,
  getFieldRequiredMessage,
  getFieldTooShortMessage,
  MESSAGE_CATALOG_INVALID_USERNAME,
  MESSAGE_CATALOG_INVALID_PASSWORD,
  MESSAGE_CATALOG_INVALID_SECRET,
  getFieldTooLongMessage,
} from 'libraries/constants';
import { REACT_APP_ALPHA_FEATURE_ENABLED } from 'libraries/envVars';
import _get from 'lodash.get';
import _set from 'lodash.set';
import CatalogSchema, {
  AccessTemplate,
  Field,
  SliderField,
  Unit,
} from 'types/catalog';
import { RunConfig } from 'types/proto/models_pb';

import {
  cpuInCoreToK8sFormat,
  k8sCPUFormatToCore,
  k8sMemoryFormatToMB,
  memoryInMBToK8sFormat,
} from './service';

export const getSchemaByName = (name: CatalogTypes): CatalogSchema | null => {
  switch (name) {
    case CATALOG_POSTGRES:
      return CatalogSchemaPostgreSQL;
    case CATALOG_MONGODB:
      return CatalogSchemaMongoDB;
    case CATALOG_REDIS:
      return CatalogSchemaRedis;
    case CATALOG_MYSQL:
      return CatalogSchemaMySQL;
    case CATALOG_MINIO:
      return CatalogSchemaMinio;
  }
  return null;
};

export const getInitialValuesFromSchema = (
  schema: CatalogSchema,
  runConfig?: RunConfig
): any => {
  const values: any = {};
  const envVars = runConfig?.getEnvvarsMap();

  schema.tabs.forEach((t) => {
    t.sections.forEach((s) => {
      s.fields.forEach((f) => {
        if (envVars) {
          const value = envVars.get(f.key);
          if (value && f.type === 'slider') {
            const field = f as SliderField;
            // lookup the index from the values
            const actualValue = fromK8SUnit(value, f.unit);
            const fieldIndex = field.values.findIndex((v) => v === actualValue);
            _set(values, f.key, fieldIndex === -1 ? 0 : fieldIndex);
          } else if (value && f.type === 'switch') {
            // change it to boolean
            _set(values, f.key, value === 'true');
          } else if (value) {
            _set(values, f.key, value);
          } else {
            _set(values, f.key, f.default);
          }
        } else {
          _set(values, f.key, f.default);
        }
      });
    });
  });

  return values;
};

export const getValidateFunction = (
  schema: CatalogSchema
): ((values: any) => void) => (values) => {
  const errors: {
    [key: string]: string;
  } = {};

  schema.tabs.forEach((t) => {
    t.sections.forEach((s) => {
      if (s.enabledBy && !_get(values, s.enabledBy, false)) {
        return;
      }
      s.fields.forEach((f) => {
        if (f.validation) {
          // do not validate if the control is not enabled
          if (f.enabledBy && !_get(values, f.enabledBy, false)) {
            return;
          }

          const value = _get(values, f.key, '');

          if (f.validation.type === 'number') {
            f.validation.rules.forEach((r) => {
              switch (r.type) {
                case 'required': {
                  if (!value) {
                    errors[f.key] =
                      r.message || getFieldRequiredMessage(f.label);
                  }
                  break;
                }
                case 'min': {
                  if (value < r.value) {
                    errors[f.key] =
                      r.message || getFieldTooShortMessage(f.label, r.value);
                  }
                  break;
                }
                case 'max': {
                  if (value > r.value) {
                    errors[f.key] =
                      r.message || getFieldTooLongMessage(f.label, r.value);
                  }
                  break;
                }
              }
            });
          } else if (f.validation.type === 'string') {
            f.validation.rules.forEach((r) => {
              switch (r.type) {
                case 'required': {
                  if (!value) {
                    errors[f.key] =
                      r.message || getFieldRequiredMessage(f.label);
                  }
                  break;
                }
                case 'username': {
                  if (!value) {
                    errors[f.key] =
                      r.message || getFieldRequiredMessage(f.label);
                    break;
                  }

                  if (value.length < 4) {
                    errors[f.key] = getFieldTooShortMessage(f.label, 4);
                    break;
                  }

                  if (value.length > 64) {
                    errors[f.key] = getFieldTooLongMessage(f.label, 64);
                    break;
                  }

                  if (!value.match(/^[a-zA-Z][a-zA-Z0-9]+/)) {
                    errors[f.key] = MESSAGE_CATALOG_INVALID_USERNAME;
                  }
                  break;
                }
                case 'password':
                case 'secret': {
                  if (!value) {
                    errors[f.key] =
                      r.message || getFieldRequiredMessage(f.label);
                    break;
                  }

                  if (value.length < 8) {
                    errors[f.key] = getFieldTooShortMessage(f.label, 8);
                    break;
                  }

                  if (value.length > 128) {
                    errors[f.key] = getFieldTooLongMessage(f.label, 128);
                    break;
                  }

                  if (r.type === 'password') {
                    if (!value.match(/[a-zA-Z0-9!]*[a-zA-Z][a-zA-Z0-9!]*/)) {
                      errors[f.key] = MESSAGE_CATALOG_INVALID_PASSWORD;
                    }
                  } else if (r.type === 'secret') {
                    if (!value.match(/[a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*/)) {
                      errors[f.key] = MESSAGE_CATALOG_INVALID_SECRET;
                    }
                  }
                  break;
                }
              }
            });
          }
        }
      });
    });
  });
  return errors;
};

export const getFieldFromSchema = (
  schema: CatalogSchema,
  key: string
): Field | null => {
  let field: Field | null = null;
  schema.tabs.forEach((t) => {
    t.sections.forEach((s) => {
      s.fields.forEach((f) => {
        if (f.key === key) {
          field = f;
        }
      });
    });
  });
  return field;
};

export const getEnvVarsForCatalog = (
  schema: CatalogSchema,
  values: object
): Map<string, string> => {
  const envVars = new Map<string, string>();
  schema.tabs.forEach((t) => {
    t.sections.forEach((s) => {
      if (s.enabledBy && !_get(values, s.enabledBy, false)) {
        return;
      }

      s.fields.forEach((f) => {
        if (f.alpha && !REACT_APP_ALPHA_FEATURE_ENABLED) {
          return;
        }

        if (f.enabledBy && !_get(values, f.enabledBy, false)) {
          return;
        }

        const value = _get(values, f.key, '');
        if (f.type === 'slider') {
          const field = f as SliderField;
          // as it stores the index instead of value
          envVars.set(f.key, toK8SUnit(field.values[value], field.unit));
          if (f.alias) {
            f.alias.forEach((k) => {
              envVars.set(k, toK8SUnit(field.values[value], field.unit));
            });
          }
        } else if (f.type !== 'system') {
          envVars.set(f.key, `${value}`);
          if (f.alias) {
            f.alias.forEach((k) => {
              envVars.set(k, `${value}`);
            });
          }
        }

        if (f.mappings) {
          f.mappings.forEach((m) => {
            if (!m.when || value === m.when) {
              envVars.set(m.key, m.mappedValue);
            }
          });
        }
      });
    });
  });

  return envVars;
};

export const toHumanReadableUnit = (value: number, unit?: Unit): string => {
  if (!unit) {
    return `${value}`;
  }

  switch (unit) {
    case 'memory':
      return `${value} MB`;
    case 'cpu':
      return `${value} Cores`;
    case 'storage':
      return `${value} GB`;
  }
  return `${value}`;
};

export const toK8SUnit = (value: number, unit?: Unit): string => {
  if (!unit) {
    return `${value}`;
  }

  switch (unit) {
    case 'memory':
      return memoryInMBToK8sFormat(value);
    case 'cpu':
      return cpuInCoreToK8sFormat(value);
    case 'storage':
      return memoryInMBToK8sFormat(value * 1024);
  }
  return `${value}`;
};

export const fromK8SUnit = (value: string, unit?: Unit): any => {
  if (!unit) {
    return parseInt(value, 10);
  }

  switch (unit) {
    case 'memory':
      return k8sMemoryFormatToMB(value);
    case 'cpu':
      return k8sCPUFormatToCore(value);
    case 'storage':
      return k8sMemoryFormatToMB(value) / 1024;
  }
  return parseInt(value, 10);
};

export const getTemplatedValue = (
  template: string | undefined,
  envVarMap: jspb.Map<string, string> | undefined,
  schema: CatalogSchema | null
): {
  displayValue: string;
  value: string;
} => {
  if (!template) {
    return {
      displayValue: '',
      value: '',
    };
  }
  const regex = /{([\w.]*)}/g;
  let value = template;
  let displayValue = template;

  if (!schema || !envVarMap) {
    return {
      displayValue,
      value,
    };
  }

  let match;
  do {
    match = regex.exec(template);
    if (match) {
      const [, key] = match;
      if (key.startsWith('field.')) {
        const fieldKey = key.replace('field.', '');
        const repalceValue = envVarMap?.get(fieldKey) || '';
        const field = getFieldFromSchema(schema, fieldKey);

        value = value.replace(`{${key}}`, repalceValue);
        displayValue = displayValue.replace(
          `{${key}}`,
          field && field?.type === 'password' ? '********' : repalceValue
        );
      } else {
        const repalceValue = _get(schema, key, '');
        value = value.replace(`{${key}}`, repalceValue);
        displayValue = displayValue.replace(`{${key}}`, repalceValue);
      }
    }
  } while (match);

  return {
    displayValue,
    value,
  };
};

interface Cost {
  cost: number;
  replica: number;
}

export const shouldShowAccessField = (
  field: AccessTemplate,
  envVars: any
): boolean => {
  if (!field.enabledBy && !field.disabledBy) {
    return true;
  }

  if (field.enabledBy) {
    for (const key of field.enabledBy) {
      if (envVars?.get(key) !== 'true') {
        return false;
      }
    }
  }

  if (field.disabledBy) {
    for (const key of field.disabledBy) {
      if (envVars?.get(key) === 'true') {
        return false;
      }
    }
  }

  return true;
};
