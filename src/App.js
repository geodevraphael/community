// src/components/ReportForm.js
import React, { useState, useEffect } from 'react';
import {
  fetchSectors, fetchCategories,
  fetchSeverities, fetchPriorities, fetchStatuses,
  createReport
} from '../api';

export default function ReportForm() {
  const [lookups, setLookups] = useState({});
  const [form, setForm]   = useState({
    sector:'', category:'', severity:'', priority:'', status:'',
    title:'', description:'',
    latitude:null, longitude:null
  });
  const [msg, setMsg]     = useState('');

  useEffect(() => {
    Promise.all([
      fetchSectors(), fetchSeverities(),
      fetchPriorities(), fetchStatuses()
    ]).then(([sectors, sev, pri, stat]) => {
      setLookups({ sectors, severities:sev, priorities:pri, statuses:stat });
    });
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(f => ({ ...f,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }));
    });
  }, []);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        org: 1,                      // or your actual org ID
        reported_by: 1,              // your johndoe user ID
        asset: null,
        sector: Number(form.sector),
        category: Number(form.category),
        severity: Number(form.severity),
        priority: Number(form.priority),
        status:   Number(form.status),
        title: form.title,
        description: form.description,
        latitude: form.latitude,
        longitude: form.longitude
      };
      const res = await createReport(payload);
      setMsg(`Report submitted! ID ${res.id}`);
      setForm(f => ({ ...f, title:'', description:'' }));
    } catch(err) {
      console.error(err);
      setMsg('Failed to submit.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Infrastructure Report</h2>
      {msg && <p>{msg}</p>}

      <label>Sector
        <select name="sector" value={form.sector} onChange={handleChange} required>
          <option value="">— select —</option>
          {lookups.sectors?.map(s =>
            <option key={s.id} value={s.id}>{s.name}</option>
          )}
        </select>
      </label>

      <label>Category
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">— select —</option>
          {lookups.categories
            ?.filter(c => c.sector === Number(form.sector))
            .map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>
      </label>

      <label>Severity
        <select name="severity" value={form.severity} onChange={handleChange} required>
          {lookups.severities?.map(s =>
            <option key={s.id} value={s.id}>{s.name}</option>
          )}
        </select>
      </label>

      <label>Priority
        <select name="priority" value={form.priority} onChange={handleChange} required>
          {lookups.priorities?.map(p =>
            <option key={p.id} value={p.id}>{p.name}</option>
          )}
        </select>
      </label>

      <label>Status
        <select name="status" value={form.status} onChange={handleChange} required>
          {lookups.statuses?.map(s =>
            <option key={s.id} value={s.id}>{s.name}</option>
          )}
        </select>
      </label>

      <label>Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </label>

      <p>Coords: {form.latitude?.toFixed(5)}, {form.longitude?.toFixed(5)}</p>

      <button type="submit">Submit Report</button>
    </form>
  );
}
