import { BROWSERSTACK_DEFAULTS } from './browserstack.config';

export interface BrowserStackPlanResponse {
  automate_plan: string;
  parallel_sessions_max_allowed: number;
  parallel_sessions_running: number;
  queued_sessions: number;
}

export class BrowserStackClient {
  private user: string;
  private key: string;
  private authHeader: string;

  constructor(user = BROWSERSTACK_DEFAULTS.USERNAME, key = BROWSERSTACK_DEFAULTS.ACCESS_KEY) {
    this.user = user;
    this.key = key;
    this.authHeader = `Basic ${Buffer.from(`${this.user}:${this.key}`).toString('base64')}`;
  }

  /**
   * Validates account plan and concurrent session availability.
   */
  async getPlan(): Promise<BrowserStackPlanResponse> {
    const res = await fetch('https://api-cloud.browserstack.com/app-automate/plan.json', {
      headers: { Authorization: this.authHeader },
    });
    if (!res.ok) {
      throw new Error(`BrowserStack Plan API failed with HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<BrowserStackPlanResponse>;
  }

  /**
   * Fetches list of recently uploaded mobile application packages.
   */
  async getRecentApps(): Promise<any[]> {
    const res = await fetch('https://api-cloud.browserstack.com/app-automate/recent_apps', {
      headers: { Authorization: this.authHeader },
    });
    if (!res.ok) {
      throw new Error(`BrowserStack Recent Apps API failed with HTTP ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  /**
   * Fetches list of recent automated builds and execution status.
   */
  async getBuilds(limit = 10): Promise<any[]> {
    const res = await fetch(`https://api-cloud.browserstack.com/app-automate/builds.json?limit=${limit}`, {
      headers: { Authorization: this.authHeader },
    });
    if (!res.ok) {
      throw new Error(`BrowserStack Builds API failed with HTTP ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
}
