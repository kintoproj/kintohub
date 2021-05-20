export const REACT_APP_SERVER_URL = getEnvVar('{REACT_APP_SERVER_URL}');

export const REACT_APP_LOCAL_STORAGE_KEY_APPEND = getEnvVar(
  '{REACT_APP_LOCAL_STORAGE_KEY_APPEND}'
);

export const REACT_APP_ALPHA_FEATURE_ENABLED = asBoolean(
  getEnvVar('{REACT_APP_ALPHA_FEATURE_ENABLED}')
);

export const REACT_APP_SLEEP_MODE_TTL_MINUTES = asNumber(
  getEnvVar('{REACT_APP_SLEEP_MODE_TTL_MINUTES}'),
  5
);

export const REACT_APP_LOCAL_STORAGE_VERSION = getEnvVar(
  '{REACT_APP_LOCAL_STORAGE_VERSION}'
);

/** When in develop mode, read env vars normally, when in production output a
 * special string that will be replaced by script
 * @param {string} envVar the env var name
 * @return {string} the env var value
 */
function getEnvVar(envVarStr: string): string {
  // is true when running: npm run build
  const isProd = process.env.NODE_ENV === 'production';
  const envVar = envVarStr.replace('{', '').replace('}', '');
  return isProd ? envVarStr : process.env[envVar] || '';
}

function asBoolean(value: string): boolean {
  return value === 'true';
}

function asNumber(value: string, fallback: number): number {
  const v = parseInt(value, 10);
  return isNaN(v) ? fallback : v;
}
