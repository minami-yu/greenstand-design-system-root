import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { resolveFontFamily, useTheme } from '../theme';

type TokenCardProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  style?: ViewStyle;
};

export function TokenCard({ title, subtitle, children, style }: TokenCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.colorBackgroundBaseContainer,
          borderColor: theme.colors.colorBorderBaseDefault
        },
        style
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.colorTextBasePrimary }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.colors.colorTextBaseSecondary }]}>
          {subtitle}
        </Text>
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  content: {
    gap: 12
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20
  },
  title: {
    fontFamily: resolveFontFamily('Montserrat', '600'),
    fontSize: 18,
    lineHeight: 24
  }
});
