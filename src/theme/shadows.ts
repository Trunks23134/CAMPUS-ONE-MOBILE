import { Platform } from 'react-native';

/**
 * Platform-aware shadow helper.
 * - iOS/Android: uses native shadow props + elevation
 * - Web: uses CSS boxShadow to avoid the deprecation warning
 *
 * Usage:
 *   style={[styles.card, shadow(0, 4, 8, 'rgba(0,0,0,0.1)')]}
 */
export function shadow(
  offsetX: number,
  offsetY: number,
  radius: number,
  color: string,
  elevation = 4
): object {
  if (Platform.OS === 'web') {
    return {
      // @ts-ignore — boxShadow is valid on web
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px ${color}`,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: 1,
    shadowRadius: radius,
    elevation,
  };
}

/** Preset shadows */
export const shadows = {
  /** Subtle card shadow */
  card: shadow(0, 1, 4, 'rgba(0,0,0,0.08)', 2),
  /** Medium card shadow */
  cardMd: shadow(0, 2, 8, 'rgba(0,0,0,0.10)', 3),
  /** Primary button glow */
  primaryBtn: shadow(0, 4, 8, 'rgba(245,158,11,0.30)', 4),
  /** Subtle primary glow */
  primaryBtnSm: shadow(0, 4, 8, 'rgba(245,158,11,0.20)', 4),
  /** FAB shadow */
  fab: shadow(0, 4, 8, 'rgba(0,0,0,0.20)', 8),
};
