const colors = {
  primary: '#1D9E75',
  cardBackground: '#E1F5EE',
  accent: '#FAC775',
  danger: '#E24B4A',
  neutral: '#D3D1C7',
  text: '#1A1A1A',
  textMuted: '#6B7280',
  white: '#FFFFFF',
} as const;

export type ColorKey = keyof typeof colors;
export default colors;
