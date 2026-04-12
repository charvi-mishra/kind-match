// src/hooks/useSocialLinks.js
// Uses apiCall from AuthContext — same pattern as MatchesPage, DiscoverPage, etc.
// This ensures the auth token is handled exactly the way your app expects.

import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export function useSocialLinks() {
  const { apiCall } = useAuth();

  const saveSocialLinks = useCallback(async ({ instagram, whatsapp }) => {
    try {
      const data = await apiCall('PUT', '/profile/social-links', { instagram, whatsapp });
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, message: err.message ?? 'Network error — try again' };
    }
  }, [apiCall]);

  return { saveSocialLinks };
}