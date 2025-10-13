import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';

const getConfigPath = (): string => {
  const platform = process.platform;
  if (platform === 'darwin' || platform === 'linux') {
    return join(homedir(), '.config', 'claude-code', 'claude_desktop_config.json');
  }
  if (platform === 'win32') {
    const appData = process.env.APPDATA;
    if (!appData) throw new Error('APPDATA environment variable not found');
    return join(appData, 'Claude', 'claude_desktop_config.json');
  }
  throw new Error(`Unsupported platform: ${platform}`);
};

const playwrightConfig = {
  command: 'npx',
  args: ['-y', '@executeautomation/playwright-mcp-server']
};

const togglePlaywrightMcp = () => {
  const configPath = getConfigPath();

  let config: any;

  if (!existsSync(configPath)) {
    console.log(`Config file not found. Creating new config at: ${configPath}`);
    const configDir = dirname(configPath);
    mkdirSync(configDir, { recursive: true });
    config = { mcpServers: {} };
  } else {
    const configContent = readFileSync(configPath, 'utf-8');
    config = JSON.parse(configContent);
  }

  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  const isEnabled = !!config.mcpServers.playwright;

  if (isEnabled) {
    delete config.mcpServers.playwright;
    console.log('✓ Playwright MCP disabled');
  } else {
    config.mcpServers.playwright = playwrightConfig;
    console.log('✓ Playwright MCP enabled');
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`\nConfig updated at: ${configPath}`);
  console.log('\nRestart Claude Code for changes to take effect.');
};

togglePlaywrightMcp();
