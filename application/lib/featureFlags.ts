import * as configcat from 'configcat-js-ssr';

// Initialize ConfigCat client
const configCatClient = configcat.getClient(
  process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY || '',
  configcat.PollingMode.AutoPoll,
  {
    pollIntervalSeconds: 60, // Poll for changes every 60 seconds
    setupHooks: (hooks) => {
      hooks.on('clientReady', () => console.log('ConfigCat client is ready'));
    },
  }
);

export interface NavigationConfig {
  tree: boolean;
  history: boolean;
  people: boolean;
  acknowledgements: boolean;
  practice: boolean;
}

// Default navigation config (fallback if ConfigCat fails)
const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
  tree: true,
  history: true,
  people: true,
  acknowledgements: true,
  practice: true,
};

/**
 * Get navigation configuration from ConfigCat
 * Uses a text setting that contains a JSON string
 */
export async function getNavigationConfig(): Promise<NavigationConfig> {
  try {
    // Get the text setting from ConfigCat
    const configText = await configCatClient.getValueAsync(
      'navigation_config',
      JSON.stringify(DEFAULT_NAVIGATION_CONFIG)
    );

    // Parse the JSON string
    const config = JSON.parse(configText as string);
    return config as NavigationConfig;
  } catch (error) {
    console.error('Error fetching navigation config from ConfigCat:', error);
    return DEFAULT_NAVIGATION_CONFIG;
  }
}

/**
 * Get a specific feature flag value
 */
export async function getFeatureFlag(
  flagKey: string,
  defaultValue: boolean = false
): Promise<boolean> {
  try {
    return await configCatClient.getValueAsync(flagKey, defaultValue);
  } catch (error) {
    console.error(`Error fetching feature flag '${flagKey}' from ConfigCat:`, error);
    return defaultValue;
  }
}

/**
 * Close ConfigCat client (call on app shutdown)
 */
export function closeConfigCat() {
  configCatClient.dispose();
}

export default configCatClient;
