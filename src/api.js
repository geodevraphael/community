import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export function fetchSectors()    { return api.get('/sectors').then(r => r.data); }
export function fetchCategories(sectorId) {
  return api.get('/categories', { params: { sector: sectorId } }).then(r => r.data);
}
export function fetchSeverities() { return api.get('/severities').then(r => r.data); }
export function fetchPriorities() { return api.get('/priorities').then(r => r.data); }
export function fetchStatuses()   { return api.get('/statuses').then(r => r.data); }

export function listReports()     { return api.get('/reports').then(r => r.data); }
export function createReport(payload) {
  return api.post('/reports', payload).then(r => r.data);
}

export default api;
