import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { fetchStatCards, type StatCard } from '../api/stat-cards';

export function StatCards() {
    const { data: statCards = [], isLoading, error } = useQuery<StatCard[]>({
        queryKey: ['statCards'],
        queryFn: fetchStatCards
    });

    if (isLoading) {
        return (
            <View style={styles.grid}>
                {[1, 2, 3].map((i) => (
                    <Card key={i} style={styles.card}>
                        <CardHeader>
                            <CardTitle>Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <View style={styles.loadingBar} />
                            <View style={[styles.loadingBar, styles.mt4]} />
                        </CardContent>
                    </Card>
                ))}
            </View>
        );
    }

    if (error) {
        return <Text style={styles.error}>Error loading stat cards</Text>;
    }

    return (
        <View style={styles.grid}>
            {statCards.map((card, index) => (
                <Card key={index} style={styles.card}>
                    <CardHeader>
                        <CardTitle>{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <View style={styles.flexBetween}>
                            <Text style={styles.timeText}>{card.time}</Text>
                            <Text style={styles.landingsText}>
                                {card.landings} ldgs
                            </Text>
                        </View>
                        <View style={styles.mt4}>
                            {/* <Progress value={card.progress} /> */}
                            <Text style={styles.limitText}>
                                Limit: {card.limit}
                            </Text>
                        </View>
                    </CardContent>
                </Card>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: -8
    },
    card: {
        flex: 1,
        minWidth: 300,
        margin: 8
    },
    flexBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827'
    },
    landingsText: {
        fontSize: 14,
        color: '#6b7280'
    },
    limitText: {
        marginTop: 8,
        fontSize: 12,
        color: '#6b7280'
    },
    mt4: {
        marginTop: 16
    },
    error: {
        color: '#ef4444'
    },
    loadingBar: {
        height: 16,
        width: '50%',
        backgroundColor: '#e5e7eb',
        borderRadius: 4
    }
}); 