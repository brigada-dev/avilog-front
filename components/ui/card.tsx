import * as React from "react"
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native"

interface CardProps extends ViewProps {}
interface CardHeaderProps extends ViewProps {}
interface CardTitleProps extends TextProps {}
interface CardContentProps extends ViewProps {}

export const Card: React.FC<CardProps> = ({ style, ...props }) => (
  <View style={[styles.card, style]} {...props} />
)

export const CardHeader: React.FC<CardHeaderProps> = ({ style, ...props }) => (
  <View style={[styles.cardHeader, style]} {...props} />
)

export const CardTitle: React.FC<CardTitleProps> = ({ style, ...props }) => (
  <Text style={[styles.cardTitle, style]} {...props} />
)

export const CardContent: React.FC<CardContentProps> = ({ style, ...props }) => (
  <View style={[styles.cardContent, style]} {...props} />
)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  cardContent: {
    padding: 16,
    paddingTop: 0
  }
}) 