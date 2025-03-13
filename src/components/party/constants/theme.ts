/**
 * Chart colors
 */
export const CHART_COLORS = [
    '#2563eb', // blue
    '#14b8a6', // teal
    '#f59e0b', // amber
    '#ec4899', // pink
    '#10b981', // emerald
    '#1e3a8a', // indigo
    '#6366f1', // violet
    '#8b5cf6', // purple
    '#d946ef', // fuchsia
    '#f43f5e', // rose
  ];
  
  /**
   * Eater profile colors
   */
  export const PROFILE_COLORS = ['#10b981', '#6366f1', '#f59e0b'];
  
  /**
   * Format risk level as text
   */
  export const formatRiskLevel = (risk: number): string => {
    if (risk < 5) return 'Muy bajo';
    if (risk < 10) return 'Bajo';
    if (risk < 20) return 'Moderado';
    if (risk < 30) return 'Alto';
    return 'Muy alto';
  };
  
  /**
   * Get risk color based on risk level
   */
  export const getRiskColor = (risk: number): 'success' | 'warning' | 'error' => {
    if (risk < 5) return 'success';
    if (risk < 10) return 'success';
    if (risk < 20) return 'warning';
    if (risk < 30) return 'warning';
    return 'error';
  };