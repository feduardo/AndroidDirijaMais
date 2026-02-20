export const colors = {

  backgroundSecondary: '#E0E0E0',
  primaryLight: '#E3F2FD',
  primary: '#1976D2',
  secondary: '#4CAF50',
  accent: '#42A5F5',
  error: '#E53935',
  warning: '#FFC107',
  success: '#4CAF50',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  disabled: '#BDBDBD',
  onPrimary: '#FFFFFF',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  states: {
    disabled: '#BDBDBD',
    pressed: '#1565C0',
    hover: '#1E88E5',
    
  },
  outline: '#E0E0E0',
  outlineVariant: '#BDBDBD',
  divider: '#E0E0E0',
  successLight: 'rgba(76, 175, 80, 0.1)',
  errorLight: 'rgba(229, 57, 53, 0.1)',
  warningLight: 'rgba(255, 193, 7, 0.1)',
  shadow: {
    card: 'rgba(0,0,0,0.08)',
    button: 'rgba(0,0,0,0.15)',
  },
} as const;

export type Colors = typeof colors;