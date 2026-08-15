import { getSupabase, isSupabaseConnected } from '../lib/supabase';
import { 
  Project, 
  PricingPackage, 
  ServiceOffering,
  EstimatorServiceOption, 
  EstimatorScopeOption, 
  EstimatorTimelineOption, 
  ExperienceItem, 
  SkillItem,
  SiteSettings,
  PageContentRow,
  DbFaq,
  ContactMessage,
  EstimateLead,
  AnalyticsData
} from '../types';


// ------------------------------------------------------------------
// ADMIN AUTH — HMAC token issued by POST /api/admin/verify (server-side PIN)
// ------------------------------------------------------------------
const ADMIN_TOKEN_KEY = 'clayfolio_admin_token';

export const getAdminToken = (): string => {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const setAdminToken = (token: string) => {
  try {
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch { /* ignore */ }
};

const adminHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = getAdminToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

export const verifyAdminPin = async (pin: string): Promise<{ ok: boolean; error?: string }> => {
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const json = await res.json();
    if (res.ok && json.token) {
      setAdminToken(json.token);
      return { ok: true };
    }
    return { ok: false, error: json.error || 'PIN salah.' };
  } catch {
    return { ok: false, error: 'Server tidak dapat dijangkau.' };
  }
};

export const changeAdminPin = async (currentPin: string, newPin: string): Promise<{ ok: boolean; error?: string }> => {
  try {
    const res = await adminFetch('/api/admin/change-pin', {
      method: 'POST',
      body: JSON.stringify({ currentPin, newPin }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    return { ok: false, error: json.error || 'Gagal mengubah PIN.' };
  } catch {
    return { ok: false, error: 'Server tidak dapat dijangkau.' };
  }
};

const adminFetch = (path: string, opts: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(opts.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getAdminToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(path, { ...opts, headers });
};

export const fetchAdminMessages = async (): Promise<ContactMessage[]> => {
  try {
    const res = await adminFetch('/api/messages');
    if (!res.ok) return [];
    const body = await res.json();
    return (body.messages || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      serviceInterest: m.project_type || '',
      budget: m.budget || '',
      message: m.message,
      createdAt: m.created_at || new Date().toISOString(),
      read: m.status === 'read',
    }));
  } catch {
    return [];
  }
};

export const markAdminMessageRead = async (id: string): Promise<boolean> => {
  try {
    const res = await adminFetch(`/api/messages/${id}/read`, { method: 'PATCH' });
    return res.ok;
  } catch {
    return false;
  }
};

export const deleteAdminMessage = async (id: string): Promise<boolean> => {
  try {
    const res = await adminFetch(`/api/messages/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
};

export const fetchAdminEstimates = async (): Promise<EstimateLead[]> => {
  try {
    const res = await adminFetch('/api/estimates');
    if (!res.ok) return [];
    const body = await res.json();
    return (body.estimates || []).map((e: any) => ({
      id: e.id,
      clientName: e.client_name,
      clientEmail: e.client_email,
      clientPhone: e.client_phone,
      serviceType: e.service_type,
      deliverables: e.deliverables || [],
      urgency: e.urgency,
      estimatedPrice: e.estimated_price,
      notes: e.notes,
      status: e.status,
      createdAt: e.created_at,
    }));
  } catch {
    return [];
  }
};

export const fetchAdminAnalytics = async (): Promise<Partial<AnalyticsData> | null> => {
  try {
    const res = await adminFetch('/api/analytics');
    if (!res.ok) return null;
    const json = await res.json();
    return {
      totalVisitors: json.counts?.page_visit ?? 0,
      projectViews: json.counts?.project_view ?? 0,
      inquiriesSent: json.counts?.inquiry ?? 0,
      cvDownloads: json.counts?.cv_download ?? 0,
      topProjects: json.topProjects || [],
      visitorByCountry: json.countries || [],
    };
  } catch {
    return null;
  }
};

// Public event tracking — fire-and-forget, never blocks UI.
export const trackEvent = (type: 'page_visit' | 'project_view' | 'cv_download' | 'inquiry', page?: string, label?: string) => {
  try {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, page: page || null, label: label || null }),
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
};

// Upload a file to Supabase Storage via the admin API (admin token required).
// Returns a public URL on success, null on failure (caller falls back to data-URL).
export const uploadAsset = async (file: File): Promise<string | null> => {
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String((reader.result as string).split(',')[1] || ''));
      reader.onerror = () => reject(new Error('read failed'));
      reader.readAsDataURL(file);
    });
    if (!base64) return null;
    const res = await adminFetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ base64, fileType: file.type || 'application/octet-stream', folder: 'uploads' }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.url || null;
  } catch {
    return null;
  }
};


export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message: string;
}

export interface EstimateFormData {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceType: string;
  deliverables: string[];
  urgency: string;
  estimatedPrice: number;
  estimatedPriceIdr?: number;
  notes?: string;
}

// Check Backend & Supabase Status
export const checkBackendStatus = async () => {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API connection check fallback:', err);
  }
  return {
    status: 'client-only',
    supabaseConnected: isSupabaseConnected(),
  };
};

// Submit Contact Inquiry — server is authoritative (DB insert + Telegram
// alert + rate-limit). Direct client insert is a fallback ONLY when the
// server is unreachable, so a single lead never lands twice in the DB.
export const submitContactInquiry = async (data: ContactFormData) => {
  let backendResult = null;
  let supabaseResult = null;

  // 1. Express API Endpoint
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      backendResult = await response.json();
    }
  } catch (err) {
    console.warn('Express /api/contact endpoint warning:', err);
  }

  // 2. Direct Supabase client — fallback only when the server side didn't persist
  if (!backendResult?.success) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: dbData, error } = await supabase
          .from('messages')
          .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            project_type: data.projectType || null,
            budget: data.budget || null,
            message: data.message,
            status: 'unread'
          }])
          .select();

        if (!error) {
          supabaseResult = dbData?.[0];
        } else {
          console.error('Direct Supabase insert error:', error);
        }
      } catch (err) {
        console.error('Supabase client exception:', err);
      }
    }
  }

  return {
    success: true,
    backendResult,
    supabaseResult,
    savedToSupabase: Boolean(supabaseResult || backendResult?.success),
  };
};

// Submit Estimate Submission — same rule as contact: server first, client
// insert only as a fallback, never a duplicate.
export const submitEstimateInquiry = async (data: EstimateFormData) => {
  let backendResult = null;
  let supabaseResult = null;

  // 1. Express API Endpoint
  try {
    const response = await fetch('/api/estimates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      backendResult = await response.json();
    }
  } catch (err) {
    console.warn('Express /api/estimates endpoint warning:', err);
  }

  // 2. Supabase Client — fallback only
  if (!backendResult?.success) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: dbData, error } = await supabase
          .from('estimates')
          .insert([{
            client_name: data.clientName,
            client_email: data.clientEmail || (data.clientPhone ? `wa:${data.clientPhone}` : null),
            client_phone: data.clientPhone || null,
            service_type: data.serviceType,
            deliverables: data.deliverables,
            urgency: data.urgency,
            estimated_price: data.estimatedPrice,
            estimated_price_idr: data.estimatedPriceIdr || null,
            notes: data.notes || null,
            status: 'pending'
          }])
          .select();

        if (!error) {
          supabaseResult = dbData?.[0];
        }
      } catch (err) {
        console.error('Supabase estimate insert error:', err);
      }
    }
  }

  return {
    success: true,
    backendResult,
    supabaseResult,
    savedToSupabase: Boolean(supabaseResult || backendResult?.success),
  };
};

// Fetch Projects from Supabase or Express API
export const fetchProjectsFromSupabase = async (): Promise<Project[] | null> => {
  // 1. Direct Supabase client check
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || '',
          category: item.category,
          thumbnail: item.thumbnail || '',
          images: item.images || [],
          client: item.client || '',
          year: item.year || '',
          role: item.role || '',
          summary: item.summary || '',
          problemStatement: item.problem_statement || '',
          workflowSteps: item.workflow_steps || [],
          solution: item.solution || '',
          results: item.results || [],
          tools: item.tools || [],
          liveUrl: item.live_url || '',
          featured: item.featured ?? false,
        }));
      }
    } catch (err) {
      console.warn('Direct Supabase fetch error, trying backend endpoint:', err);
    }
  }

  // 2. Fallback to Express backend endpoint
  try {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const body = await res.json();
      if (body.projects && body.projects.length > 0) {
        return body.projects.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || '',
          category: item.category,
          thumbnail: item.thumbnail || '',
          images: item.images || [],
          client: item.client || '',
          year: item.year || '',
          role: item.role || '',
          summary: item.summary || '',
          problemStatement: item.problem_statement || item.problemStatement || '',
          workflowSteps: item.workflow_steps || item.workflowSteps || [],
          solution: item.solution || '',
          results: item.results || [],
          tools: item.tools || [],
          liveUrl: item.live_url || item.liveUrl || '',
          featured: item.featured ?? false,
        }));
      }
    }
  } catch (err) {
    console.warn('Backend API fetch projects warning:', err);
  }

  return null;
};

// Save single project to Supabase
export const saveProjectToSupabase = async (project: Project): Promise<boolean> => {
  let saved = false;

  // 1. Direct Supabase Client
  const supabase = getSupabase();
  if (supabase) {
    try {
      const row = {
        id: project.id,
        title: project.title,
        subtitle: project.subtitle || '',
        category: project.category,
        thumbnail: project.thumbnail || '',
        images: project.images || [],
        client: project.client || '',
        year: project.year || '',
        role: project.role || '',
        summary: project.summary || '',
        problem_statement: project.problemStatement || '',
        workflow_steps: project.workflowSteps || [],
        solution: project.solution || '',
        results: project.results || [],
        tools: project.tools || [],
        live_url: project.liveUrl || '',
        featured: project.featured ?? false,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('projects')
        .upsert(row, { onConflict: 'id' });

      if (!error) {
        saved = true;
      } else {
        console.warn('Direct Supabase upsert error:', error.message);
      }
    } catch (err) {
      console.warn('Direct Supabase upsert exception:', err);
    }
  }

  // 2. Express Backend API
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: adminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(project),
    });
    if (res.ok) {
      saved = true;
    }
  } catch (err) {
    console.warn('Backend API project save error:', err);
  }

  return saved;
};

// Delete project from Supabase
export const deleteProjectFromSupabase = async (id: string): Promise<boolean> => {
  let deleted = false;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) deleted = true;
    } catch (err) {
      console.warn('Supabase delete project error:', err);
    }
  }

  try {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: adminHeaders() });
    if (res.ok) deleted = true;
  } catch (err) {
    console.warn('Backend API delete project error:', err);
  }

  return deleted;
};

// Bulk Master Seed All Portfolio Tables to Supabase
export const syncAllDataToSupabase = async (payload: {
  projects: Project[];
  packages: PricingPackage[];
  estimatorServices: EstimatorServiceOption[];
  estimatorScopes: EstimatorScopeOption[];
  estimatorTimelines: EstimatorTimelineOption[];
  experiences: ExperienceItem[];
  skills: SkillItem[];
  services?: ServiceOffering[];
  siteSettings?: SiteSettings;
}): Promise<{ success: boolean; syncedTables: string[]; errors: string[] }> => {
  const syncedTables: string[] = [];
  const errors: string[] = [];
  const supabase = getSupabase();

  if (!supabase) {
    return { success: false, syncedTables: [], errors: ['Supabase client not initialized. Check VITE_SUPABASE_URL & ANON_KEY.'] };
  }

  // 1. Seed Projects
  try {
    const projRows = payload.projects.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || '',
      category: p.category,
      thumbnail: p.thumbnail || '',
      images: p.images || [],
      client: p.client || '',
      year: p.year || '',
      role: p.role || '',
      summary: p.summary || '',
      problem_statement: p.problemStatement || '',
      workflow_steps: p.workflowSteps || [],
      solution: p.solution || '',
      results: p.results || [],
      tools: p.tools || [],
      live_url: p.liveUrl || '',
      featured: p.featured ?? false,
      updated_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('projects').upsert(projRows, { onConflict: 'id' });
    if (error) errors.push(`projects: ${error.message}`);
    else syncedTables.push(`Projects (${projRows.length} items)`);
  } catch (err: any) {
    errors.push(`projects: ${err.message}`);
  }

  // 2. Seed Packages (Pricing)
  try {
    const pkgRows = payload.packages.map((pkg) => ({
      id: pkg.id,
      title: pkg.name,
      description: pkg.description || '',
      price: pkg.priceIDR || '',
      timeline: pkg.deliveryTime || '',
      features: pkg.features || [],
      is_popular: pkg.popular ?? false,
      badge: pkg.badge || '',
      created_at: new Date().toISOString()
    }));
    const { error: pkgErr } = await supabase.from('packages').upsert(pkgRows, { onConflict: 'id' });
    let packagesError: any = pkgErr;
    if (pkgErr && pkgErr.message && pkgErr.message.includes('column')) {
      const minimal = pkgRows.map(({ price_usd, recommended_for, period, updated_at, ...rest }: any) => rest);
      const retry = await supabase.from('packages').upsert(minimal, { onConflict: 'id' });
      packagesError = retry.error;
    }
    if (packagesError) errors.push(`packages: ${packagesError.message}`);
    else syncedTables.push(`Packages (${pkgRows.length} items)`);
  } catch (err: any) {
    errors.push(`packages: ${err.message}`);
  }

  // 3. Seed Estimator Services
  try {
    const estServRows = payload.estimatorServices.map((es) => ({
      id: es.id,
      name: es.name,
      base_usd: es.baseUsd,
      base_idr: es.baseIdrNum,
      icon: es.icon || 'Sparkles',
      deliverables: es.deliverables || [],
      created_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('estimator_services').upsert(estServRows, { onConflict: 'id' });
    if (error) errors.push(`estimator_services: ${error.message}`);
    else syncedTables.push(`Estimator Services (${estServRows.length} items)`);
  } catch (err: any) {
    errors.push(`estimator_services: ${err.message}`);
  }

  // 4. Seed Estimator Scopes
  try {
    const scopeRows = payload.estimatorScopes.map((sc) => ({
      id: sc.id,
      label: sc.label,
      mult: sc.mult,
      description: sc.desc || '',
      created_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('estimator_scopes').upsert(scopeRows, { onConflict: 'id' });
    if (error) errors.push(`estimator_scopes: ${error.message}`);
    else syncedTables.push(`Estimator Scopes (${scopeRows.length} items)`);
  } catch (err: any) {
    errors.push(`estimator_scopes: ${err.message}`);
  }

  // 5. Seed Estimator Timelines
  try {
    const tmRows = payload.estimatorTimelines.map((tm) => ({
      id: tm.id,
      label: tm.label,
      mult: tm.mult,
      created_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('estimator_timelines').upsert(tmRows, { onConflict: 'id' });
    if (error) errors.push(`estimator_timelines: ${error.message}`);
    else syncedTables.push(`Estimator Timelines (${tmRows.length} items)`);
  } catch (err: any) {
    errors.push(`estimator_timelines: ${err.message}`);
  }

  // 6. Seed Experiences
  try {
    const expRows = payload.experiences.map((exp) => ({
      id: exp.id,
      type: exp.type || 'work',
      period: exp.period,
      role: exp.role,
      company: exp.companyOrOrg,
      location: exp.location || '',
      description: exp.description || '',
      highlights: exp.highlights || [],
      created_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('experiences').upsert(expRows, { onConflict: 'id' });
    if (error) errors.push(`experiences: ${error.message}`);
    else syncedTables.push(`Experiences (${expRows.length} items)`);
  } catch (err: any) {
    errors.push(`experiences: ${err.message}`);
  }

  // 7. Seed Skills
  try {
    const skillRows = payload.skills.map((sk) => ({
      id: sk.id,
      name: sk.name,
      category: sk.category || 'Design',
      level: sk.proficiency || 90,
      icon: sk.icon || 'Figma',
      created_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('skills').upsert(skillRows, { onConflict: 'id' });
    if (error) errors.push(`skills: ${error.message}`);
    else syncedTables.push(`Skills (${skillRows.length} items)`);
  } catch (err: any) {
    errors.push(`skills: ${err.message}`);
  }

  // 7b. Seed Services ("What I do")
  if (payload.services && payload.services.length > 0) {
    try {
      const serviceRows = payload.services.map((s) => ({
        id: s.id,
        icon: s.icon || 'Sparkles',
        title: s.title || '',
        description: s.description || '',
        deliverables: s.deliverables || [],
        created_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('services').upsert(serviceRows, { onConflict: 'id' });
      if (error) errors.push(`services: ${error.message}`);
      else syncedTables.push(`Services (${serviceRows.length} items)`);
    } catch (err: any) {
      errors.push(`services: ${err.message}`);
    }
  }

  // 8. Seed Site Settings (Profile & Web)
  if (payload.siteSettings) {
    try {
      const row: any = {
        id: 'default',
        hero_title: payload.siteSettings.heroTitle || '',
        hero_subtitle: payload.siteSettings.heroSubtitle || '',
        about_bio: payload.siteSettings.aboutBio || '',
        contact_email: payload.siteSettings.contactEmail || '',
        contact_phone: payload.siteSettings.contactPhone || '',
        whatsapp_number: payload.siteSettings.whatsappNumber || '',
        avatar_url: payload.siteSettings.avatarUrl || '',
        cv_download_url: payload.siteSettings.cvDownloadUrlIndo || payload.siteSettings.cvDownloadUrlEng || '',
        cv_download_url_indo: payload.siteSettings.cvDownloadUrlIndo || '',
        cv_download_url_eng: payload.siteSettings.cvDownloadUrlEng || '',
        social_links: payload.siteSettings.socialLinks || {},
        updated_at: new Date().toISOString()
      };

      let { error } = await supabase.from('site_settings').upsert(row, { onConflict: 'id' });
      
      // Fallback if older Supabase table schema doesn't have cv_download_url_indo / cv_download_url_eng
      if (error && error.message.includes('column')) {
        delete row.cv_download_url_indo;
        delete row.cv_download_url_eng;
        const fallback = await supabase.from('site_settings').upsert(row, { onConflict: 'id' });
        error = fallback.error;
      }

      if (error) errors.push(`site_settings: ${error.message}`);
      else syncedTables.push('Site Settings (Profile & Web)');
    } catch (err: any) {
      errors.push(`site_settings: ${err.message}`);
    }
  }

  return {
    success: errors.length === 0,
    syncedTables,
    errors
  };
};

// Packages CRUD for Supabase
export const fetchPackagesFromSupabase = async (): Promise<PricingPackage[] | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('packages').select('*').order('created_at');
    if (!error && data && data.length > 0) {
      return data.map((x: any) => ({
        id: x.id,
        name: x.title || '',
        badge: x.badge || '',
        priceUSD: x.price_usd ?? 0,
        priceIDR: x.price || '',
        period: x.period || 'per project',
        description: x.description || '',
        features: x.features || [],
        recommendedFor: x.recommended_for || '',
        deliveryTime: x.timeline || '',
        popular: x.is_popular ?? false,
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch packages exception:', err);
  }
  return null;
};

export const savePackageToSupabase = async (pkg: PricingPackage): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) return false;
  const row = {
    id: pkg.id,
    title: pkg.name,
    description: pkg.description || '',
    price: pkg.priceIDR || '',
    price_usd: pkg.priceUSD || 0,
    timeline: pkg.deliveryTime || '',
    features: pkg.features || [],
    is_popular: pkg.popular ?? false,
    badge: pkg.badge || '',
    recommended_for: pkg.recommendedFor || '',
    period: pkg.period || 'per project',
    updated_at: new Date().toISOString()
  };
  try {
    const { error } = await supabase.from('packages').upsert(row, { onConflict: 'id' });
    if (!error) return true;
    // Pre-migration DB may lack price_usd / recommended_for / period / updated_at — degrade gracefully.
    if (error.message && error.message.includes('column')) {
      const minimal = { id: pkg.id, title: pkg.name, description: pkg.description || '', price: pkg.priceIDR || '', timeline: pkg.deliveryTime || '', features: pkg.features || [], is_popular: pkg.popular ?? false, badge: pkg.badge || '' };
      const retry = await supabase.from('packages').upsert(minimal, { onConflict: 'id' });
      return !retry.error;
    }
    console.warn('Supabase save package error:', error.message);
  } catch (err) {
    console.warn('Supabase save package exception:', err);
  }
  return false;
};

export const deletePackageFromSupabase = async (id: string): Promise<boolean> => {
  let deleted = false;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (!error) deleted = true;
      else console.warn('Supabase delete package error:', error.message);
    } catch (err) {
      console.warn('Supabase delete package exception:', err);
    }
  }
  return deleted;
};

// Site Settings CRUD for Supabase
export const saveSiteSettingsToSupabase = async (settings: any): Promise<boolean> => {
  let saved = false;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const row: any = {
        id: 'default',
        hero_title: settings.heroTitle || '',
        hero_subtitle: settings.heroSubtitle || '',
        about_bio: settings.aboutBio || '',
        contact_email: settings.contactEmail || '',
        contact_phone: settings.contactPhone || '',
        whatsapp_number: settings.whatsappNumber || '',
        avatar_url: settings.avatarUrl || '',
        cv_download_url: settings.cvDownloadUrlIndo || settings.cvDownloadUrlEng || '',
        cv_download_url_indo: settings.cvDownloadUrlIndo || '',
        cv_download_url_eng: settings.cvDownloadUrlEng || '',
        social_links: settings.socialLinks || {},
        updated_at: new Date().toISOString()
      };
      let { error } = await supabase.from('site_settings').upsert(row, { onConflict: 'id' });
      if (error && error.message.includes('column')) {
        delete row.cv_download_url_indo;
        delete row.cv_download_url_eng;
        const fallback = await supabase.from('site_settings').upsert(row, { onConflict: 'id' });
        error = fallback.error;
      }
      if (!error) saved = true;
      else console.warn('Supabase save site settings error:', error.message);
    } catch (err) {
      console.warn('Supabase save site settings exception:', err);
    }
  }
  return saved;
};

export const fetchSiteSettingsFromSupabase = async (): Promise<any | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'default').single();
    if (!error && data) {
      return {
        heroTitle: data.hero_title || '',
        heroSubtitle: data.hero_subtitle || '',
        aboutBio: data.about_bio || '',
        contactEmail: data.contact_email || '',
        contactPhone: data.contact_phone || '',
        whatsappNumber: data.whatsapp_number || '',
        avatarUrl: data.avatar_url || '',
        cvDownloadUrlIndo: data.cv_download_url_indo || data.cv_download_url || '',
        cvDownloadUrlEng: data.cv_download_url_eng || data.cv_download_url || '',
        socialLinks: data.social_links || { github: '', linkedin: '', behance: '', dribbble: '', instagram: '' }
      };
    }
  } catch (err) {
    console.warn('Supabase fetch site settings exception:', err);
  }
  return null;
};

// Fetch estimator config (services / scopes / timelines) so admin edits
// pushed to Supabase actually reach fresh visitors.
export const fetchEstimatorConfigFromSupabase = async (): Promise<{
  services: EstimatorServiceOption[];
  scopes: EstimatorScopeOption[];
  timelines: EstimatorTimelineOption[];
} | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const [servicesRes, scopesRes, timelinesRes] = await Promise.all([
      supabase.from('estimator_services').select('*').order('created_at'),
      supabase.from('estimator_scopes').select('*').order('created_at'),
      supabase.from('estimator_timelines').select('*').order('created_at'),
    ]);

    const services = (servicesRes.data || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      baseUsd: s.base_usd,
      baseIdrNum: s.base_idr,
      icon: s.icon || 'Sparkles',
      deliverables: s.deliverables || [],
    }));

    const scopes = (scopesRes.data || []).map((s: any) => ({
      id: s.id,
      label: s.label,
      mult: s.mult,
      desc: s.description || '',
    }));

    const timelines = (timelinesRes.data || []).map((t: any) => ({
      id: t.id,
      label: t.label,
      mult: t.mult,
    }));

    if (services.length && scopes.length && timelines.length) {
      return { services, scopes, timelines };
    }
  } catch (err) {
    console.warn('Supabase fetch estimator config exception:', err);
  }
  return null;
};

// ============================================================
// HEADLESS CONTENT CMS (editorial copy + FAQs)
// ============================================================

export const fetchPageContent = async (): Promise<PageContentRow[]> => {
  try {
    const res = await fetch('/api/content');
    if (res.ok) {
      const body = await res.json();
      return body.rows || [];
    }
  } catch (err) {
    console.warn('fetchPageContent warning:', err);
  }
  return [];
};

export const savePageContent = async (rows: PageContentRow[]): Promise<boolean> => {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: adminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ rows }),
    });
    return res.ok;
  } catch (err) {
    console.warn('savePageContent warning:', err);
    return false;
  }
};

export const seedPageContent = async (rows: PageContentRow[]): Promise<boolean> => {
  try {
    const res = await fetch('/api/content/seed', {
      method: 'POST',
      headers: adminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ rows }),
    });
    return res.ok;
  } catch (err) {
    console.warn('seedPageContent warning:', err);
    return false;
  }
};

export const fetchDbFaqs = async (): Promise<DbFaq[]> => {
  try {
    const res = await fetch('/api/faqs');
    if (res.ok) {
      const body = await res.json();
      return body.faqs || [];
    }
  } catch (err) {
    console.warn('fetchDbFaqs warning:', err);
  }
  return [];
};

export const saveFaq = async (faq: DbFaq): Promise<boolean> => {
  try {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });
    return res.ok;
  } catch (err) {
    console.warn('saveFaq warning:', err);
    return false;
  }
};

export const deleteFaq = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.warn('deleteFaq warning:', err);
    return false;
  }
};

export const translateText = async (text: string, target: string): Promise<string> => {
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target }),
    });
    if (res.ok) {
      const body = await res.json();
      return body.translated || text;
    }
  } catch (err) {
    console.warn('translateText warning:', err);
  }
  return text;
};

// Fetch experiences from Supabase so admin edits reach visitors.
export const fetchExperiencesFromSupabase = async (): Promise<ExperienceItem[] | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('experiences').select('*').order('created_at');
    if (!error && data && data.length > 0) {
      return data.map((x: any) => ({
        id: x.id,
        type: x.type || 'work',
        role: x.role,
        companyOrOrg: x.company,
        period: x.period,
        location: x.location || '',
        description: x.description || '',
        highlights: x.highlights || [],
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch experiences exception:', err);
  }
  return null;
};

export const fetchSkillsFromSupabase = async (): Promise<SkillItem[] | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('skills').select('*').order('created_at');
    if (!error && data && data.length > 0) {
      return data.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category || 'Design',
        icon: s.icon || 'Figma',
        proficiency: s.level ?? 90,
        color: s.color || 'amber',
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch skills exception:', err);
  }
  return null;
};

// Fetch service offerings ("What I do") — the Services page reads these live.
export const fetchServicesFromSupabase = async (): Promise<ServiceOffering[] | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('services').select('*').order('created_at');
    if (!error) {
      return (data || []).map((x: any) => ({
        id: x.id,
        icon: x.icon || 'Sparkles',
        title: x.title,
        description: x.description || '',
        deliverables: x.deliverables || [],
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch services exception:', err);
  }
  return null;
};

export const saveServicesToSupabase = async (services: ServiceOffering[]): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase || services.length === 0) return false;
  try {
    const rows = services.map((s) => ({
      id: s.id,
      icon: s.icon || 'Sparkles',
      title: s.title || '',
      description: s.description || '',
      deliverables: s.deliverables || [],
      created_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('services').upsert(rows, { onConflict: 'id' });
    if (error && error.message && error.message.includes('column')) {
      // An existing table may lack deliverables — degrade gracefully.
      const minimal = rows.map(({ deliverables, ...rest }) => rest);
      const retry = await supabase.from('services').upsert(minimal, { onConflict: 'id' });
      if (retry.error) {
        console.warn('saveServicesToSupabase (retry) error:', retry.error.message);
        return false;
      }
    } else if (error) {
      console.warn('saveServicesToSupabase error:', error.message);
      return false;
    }
    try {
      const keep = rows.map((r) => r.id);
      const { data: existing } = await supabase.from('services').select('id');
      const stale = (existing || []).map((r: any) => r.id).filter((id: string) => !keep.includes(id));
      if (stale.length > 0) {
        await supabase.from('services').delete().in('id', stale);
      }
    } catch (reconErr) {
      console.warn('saveServicesToSupabase reconcile error:', reconErr);
    }
    return true;
  } catch (err: any) {
    console.warn('saveServicesToSupabase exception:', err);
    return false;
  }
};

// ------------------------------------------------------------
// AUTO-PERSIST (experiences & skills) — dashboard edits reach
// the public site without a manual "sync" button.
// ------------------------------------------------------------

export const saveExperiencesToSupabase = async (experiences: ExperienceItem[]): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase || experiences.length === 0) return false;
  try {
    const rows = experiences.map((exp) => ({
      id: exp.id,
      type: exp.type || 'work',
      period: exp.period || '',
      role: exp.role || '',
      company: exp.companyOrOrg || '',
      location: exp.location || '',
      description: exp.description || '',
      highlights: exp.highlights || [],
      created_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('experiences').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('saveExperiencesToSupabase error:', error.message);
      return false;
    }
    // Reconcile: remove DB rows that no longer exist locally (deleted in dashboard)
    const keep = rows.map((r) => r.id);
    try {
      const { data: existing } = await supabase.from('experiences').select('id');
      const stale = (existing || []).map((r: any) => r.id).filter((id: string) => !keep.includes(id));
      if (stale.length > 0) {
        await supabase.from('experiences').delete().in('id', stale);
      }
    } catch (re) {
      console.warn('saveExperiencesToSupabase reconcile error:', re);
    }
    return true;
  } catch (err: any) {
    console.warn('saveExperiencesToSupabase exception:', err);
    return false;
  }
};

export const saveSkillsToSupabase = async (skills: SkillItem[]): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase || skills.length === 0) return false;
  try {
    const rows = skills.map((sk) => ({
      id: sk.id,
      name: sk.name || '',
      category: sk.category || 'Design',
      level: sk.proficiency ?? 90,
      icon: sk.icon || 'Figma',
      color: sk.color || 'amber',
      created_at: new Date().toISOString(),
    }));
    let { error } = await supabase.from('skills').upsert(rows, { onConflict: 'id' });
    // Pre-migration DB has no color column — drop it and retry.
    if (error && error.message && error.message.includes('column')) {
      const minimal = rows.map(({ color, ...rest }) => rest);
      const retry = await supabase.from('skills').upsert(minimal, { onConflict: 'id' });
      error = retry.error;
    }
    if (error) {
      console.warn('saveSkillsToSupabase error:', error.message);
      return false;
    }
    try {
      const keep = rows.map((r) => r.id);
      const { data: existing } = await supabase.from('skills').select('id');
      const stale = (existing || []).map((r: any) => r.id).filter((id: string) => !keep.includes(id));
      if (stale.length > 0) {
        await supabase.from('skills').delete().in('id', stale);
      }
    } catch (reconErr) {
      console.warn('saveSkillsToSupabase reconcile error:', reconErr);
    }
    return true;
  } catch (err: any) {
    console.warn('saveSkillsToSupabase exception:', err);
    return false;
  }
};

export const savePackagesToSupabase = async (packages: PricingPackage[]): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase || packages.length === 0) return false;
  try {
    const rows = packages.map((pkg) => ({
      id: pkg.id,
      title: pkg.name || '',
      description: pkg.description || '',
      price: pkg.priceIDR || '',
      price_usd: pkg.priceUSD || 0,
      timeline: pkg.deliveryTime || '',
      features: pkg.features || [],
      is_popular: pkg.popular ?? false,
      badge: pkg.badge || '',
      recommended_for: pkg.recommendedFor || '',
      period: pkg.period || 'per project',
      updated_at: new Date().toISOString(),
    }));
    let { error } = await supabase.from('packages').upsert(rows, { onConflict: 'id' });
    // Pre-migration DB: drop the newer columns and retry.
    if (error && error.message && error.message.includes('column')) {
      const minimal = rows.map(({ price_usd, recommended_for, period, updated_at, ...rest }) => rest);
      const retry = await supabase.from('packages').upsert(minimal, { onConflict: 'id' });
      error = retry.error;
    }
    if (error) {
      console.warn('savePackagesToSupabase error:', error.message);
      return false;
    }
    try {
      const keep = rows.map((r) => r.id);
      const { data: existing } = await supabase.from('packages').select('id');
      const stale = (existing || []).map((r: any) => r.id).filter((id: string) => !keep.includes(id));
      if (stale.length > 0) {
        await supabase.from('packages').delete().in('id', stale);
      }
    } catch (reconErr) {
      console.warn('savePackagesToSupabase reconcile error:', reconErr);
    }
    return true;
  } catch (err: any) {
    console.warn('savePackagesToSupabase exception:', err);
    return false;
  }
};

// Auto-persist the full estimator config (services / scopes / timelines).
export const saveEstimatorConfigToSupabase = async (cfg: {
  services: EstimatorServiceOption[];
  scopes: EstimatorScopeOption[];
  timelines: EstimatorTimelineOption[];
}): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) return false;
  let allOk = true;
  try {
    const rows = cfg.services.map((s) => ({
      id: s.id,
      name: s.name || '',
      base_usd: s.baseUsd ?? 0,
      base_idr: s.baseIdrNum ?? 0,
      icon: s.icon || 'Sparkles',
      deliverables: s.deliverables || [],
      created_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('estimator_services').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('saveEstimatorConfig services error:', error.message);
      allOk = false;
    }
  } catch (err) {
    console.warn('saveEstimatorConfig services exception:', err);
    allOk = false;
  }
  try {
    const rows = cfg.scopes.map((s) => ({
      id: s.id,
      label: s.label || '',
      mult: s.mult ?? 1,
      description: s.desc || '',
      created_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('estimator_scopes').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('saveEstimatorConfig scopes error:', error.message);
      allOk = false;
    }
  } catch (err) {
    console.warn('saveEstimatorConfig scopes exception:', err);
    allOk = false;
  }
  try {
    const rows = cfg.timelines.map((t) => ({
      id: t.id,
      label: t.label || '',
      mult: t.mult ?? 1,
      created_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('estimator_timelines').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('saveEstimatorConfig timelines error:', error.message);
      allOk = false;
    }
  } catch (err) {
    console.warn('saveEstimatorConfig timelines exception:', err);
    allOk = false;
  }
  return allOk;
};

