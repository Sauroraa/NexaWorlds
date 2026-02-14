import axios, { AxiosInstance } from 'axios';

export class ApiService {
  private client: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NexaBot/1.0',
      },
    });
  }

  // --- Staff ---
  async getStaffList() {
    const { data } = await this.client.get('/staff/members');
    return data;
  }

  async getStaffActivity(userId: string) {
    const { data } = await this.client.get(`/staff/activity/${userId}`);
    return data;
  }

  async addStaffWarning(targetId: string, reason: string, issuedBy: string) {
    const { data } = await this.client.post('/staff/warnings', { targetId, reason, issuedBy });
    return data;
  }

  async getStaffWarnings(userId: string) {
    const { data } = await this.client.get(`/staff/warnings/${userId}`);
    return data;
  }

  async promoteStaff(userId: string, promotedBy: string) {
    const { data } = await this.client.post(`/staff/promote/${userId}`, { promotedBy });
    return data;
  }

  async demoteStaff(userId: string, demotedBy: string) {
    const { data } = await this.client.post(`/staff/demote/${userId}`, { demotedBy });
    return data;
  }

  // --- Reputation ---
  async getRepProfile(username: string) {
    const { data } = await this.client.get(`/reputation/${username}`);
    return data;
  }

  async addReputation(username: string, amount: number, reason: string, givenBy: string) {
    const { data } = await this.client.post('/reputation/add', { username, amount, reason, givenBy });
    return data;
  }

  async removeReputation(username: string, amount: number, reason: string, removedBy: string) {
    const { data } = await this.client.post('/reputation/remove', { username, amount, reason, removedBy });
    return data;
  }

  async getRepLeaderboard(limit = 10) {
    const { data } = await this.client.get(`/reputation/leaderboard?limit=${limit}`);
    return data;
  }

  // --- Servers ---
  async getServers() {
    const { data } = await this.client.get('/servers');
    return data;
  }

  async getServerStats(id: string) {
    const { data } = await this.client.get(`/servers/${id}/stats`);
    return data;
  }

  // --- Stats ---
  async getGlobalStats() {
    const { data } = await this.client.get('/stats/global');
    return data;
  }

  // --- Users ---
  async getUserByUsername(username: string) {
    const { data } = await this.client.get(`/users/username/${username}`);
    return data;
  }

  async getVoteStats() {
    const { data } = await this.client.get('/votes/stats');
    return data;
  }

  async getTopVoters(limit = 10) {
    const { data } = await this.client.get(`/votes/top?limit=${limit}`);
    return data;
  }

  // --- Tickets ---
  async createTicket(ticket: { userId: string; channelId: string; category: string; subject: string; description: string }) {
    const { data } = await this.client.post('/tickets', ticket);
    return data;
  }

  async closeTicket(channelId: string, closedBy: string) {
    const { data } = await this.client.patch(`/tickets/close/${channelId}`, { closedBy });
    return data;
  }

  async getTickets() {
    const { data } = await this.client.get('/tickets');
    return data;
  }

  // --- Warnings ---
  async addWarning(warning: { userId: string; reason: string; issuedBy: string }) {
    const { data } = await this.client.post('/moderation/warnings', warning);
    return data;
  }

  async getWarnings(userId: string) {
    const { data } = await this.client.get(`/moderation/warnings/${userId}`);
    return data;
  }

  // --- Moderation Logs ---
  async logModeration(log: { userId: string; type: string; reason: string; issuedBy: string; duration?: string }) {
    const { data } = await this.client.post('/moderation/logs', log);
    return data;
  }

  // --- Server Control ---
  async controlServer(serverName: string, action: string, performedBy: string) {
    const { data } = await this.client.post(`/servers/${serverName}/${action}`, { performedBy });
    return data;
  }

  async getServerConsole(serverName: string, lines: number) {
    const { data } = await this.client.get(`/servers/${serverName}/console?lines=${lines}`);
    return data;
  }

  // --- Shop ---
  async getShopProfile(username: string) {
    const { data } = await this.client.get(`/shop/profile/${username}`);
    return data;
  }

  async getShopHistory(username: string) {
    const { data } = await this.client.get(`/shop/history/${username}`);
    return data;
  }

  async getTopBuyers() {
    const { data } = await this.client.get('/shop/top');
    return data;
  }

  async getShopStats() {
    const { data } = await this.client.get('/shop/stats');
    return data;
  }

  // --- Votes ---
  async getVoteStatsByUser(userId: string) {
    const { data } = await this.client.get(`/votes/user/${userId}`);
    return data;
  }

  // --- Leaderboards ---
  async getMoneyLeaderboard() {
    const { data } = await this.client.get('/leaderboard/money');
    return data;
  }

  async getKillsLeaderboard() {
    const { data } = await this.client.get('/leaderboard/kills');
    return data;
  }

  // --- Recruitment ---
  async submitApplication(application: { discord: string; age: number; experience: string; motivation: string; disponibilite: string; userId: string }) {
    const { data } = await this.client.post('/recruitment/apply', application);
    return data;
  }

  async getApplicationByUser(userId: string) {
    const { data } = await this.client.get(`/recruitment/user/${userId}`);
    return data;
  }

  async getApplications() {
    const { data } = await this.client.get('/recruitment/all');
    return data;
  }
}
