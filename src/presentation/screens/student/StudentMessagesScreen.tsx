import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Text, ActivityIndicator, Avatar, Badge, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BookingRepository from '@/infrastructure/repositories/BookingRepository';
import { colors } from '@/presentation/theme';

const { width } = Dimensions.get('window');

type ChatItem = {
  bookingId: string;
  title: string;
  subtitle: string;
  chatEnabled: boolean;
  scheduledAt: string;
  group: 'active' | 'closed';
  lastMessage?: string;
  unreadCount?: number;
  avatarColor: string;
};

export const StudentMessagesScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<ChatItem[]>([]);

  // Função para gerar cor baseada no nome
  const getAvatarColor = (name: string): string => {
    const colors = [
      '#1976D2', // Blue
      '#4CAF50', // Green
      '#FF9800', // Orange
      '#9C27B0', // Purple
      '#F44336', // Red
      '#00BCD4', // Cyan
      '#FF5722', // Deep Orange
      '#673AB7', // Deep Purple
      '#3F51B5', // Indigo
      '#009688', // Teal
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const load = useCallback(async () => {
    try {
      const bookings = await BookingRepository.listStudentBookings();
      const activeStatuses = new Set(['accepted', 'in_progress']);

      const chats: ChatItem[] = bookings.map((b) => {
        const isActive = activeStatuses.has(b.status);
        const avatarColor = getAvatarColor(b.instructor_name || 'Instrutor');

        return {
          bookingId: b.id,
          title: b.instructor_name || 'Instrutor',
          subtitle: isActive ? 'Chat ativo' : 'Chat encerrado',
          chatEnabled: isActive,
          scheduledAt: b.scheduled_date,
          group: isActive ? 'active' : 'closed',
          lastMessage: 'Última mensagem',
          unreadCount: isActive ? Math.floor(Math.random() * 5) : 0,
          avatarColor,
        };
      });

      // Ordenação: ativos primeiro, depois por data
      chats.sort((a, b) => {
        if (a.group !== b.group) return a.group === 'active' ? -1 : 1;
        return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime();
      });

      setItems(chats);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);



  const renderItem = ({ item }: { item: ChatItem }) => {
    const initials = item.title
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('StudentChat', { bookingId: item.bookingId })}
      >
        <Surface style={styles.card} elevation={1}>
          <View style={styles.cardContent}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                <Text style={styles.avatarText}>{initials}</Text>
                {item.group === 'active' && (
                  <View style={styles.onlineIndicator} />
                )}
              </View>
            </View>

            {/* Informações da conversa */}
            <View style={styles.infoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>

              </View>

              <View style={styles.messageRow}>
                <Icon
                  name={item.chatEnabled ? 'message-text' : 'message-text-outline'}
                  size={16}
                  color={item.chatEnabled ? colors.primary : colors.textSecondary}
                  style={styles.messageIcon}
                />
                <Text
                  style={[
                    styles.subtitle,
                    !item.chatEnabled && styles.closedSubtitle,
                  ]}
                  numberOfLines={1}
                >
                  {item.subtitle}
                </Text>
              </View>

              {item.lastMessage && (
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              )}
            </View>

            {/* Indicadores */}
            <View style={styles.indicatorContainer}>
              {item.unreadCount && item.unreadCount > 0 ? (
                <Badge size={24} style={styles.badge}>
                  {item.unreadCount > 9 ? '9+' : item.unreadCount}
                </Badge>
              ) : null}
              <Icon
                name="chevron-right"
                size={24}
                color={colors.textSecondary}
              />
            </View>
          </View>

          {/* Status indicator */}
          <View
            style={[
              styles.statusIndicator,
              item.group === 'active'
                ? styles.statusActive
                : styles.statusClosed,
            ]}
          />
        </Surface>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Conversas</Text>
      <Text style={styles.headerSubtitle}>
        {items.filter((i) => i.group === 'active').length} ativas • {items.length} total
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="message-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Nenhuma conversa</Text>
      <Text style={styles.emptySubtitle}>
        Quando você tiver aulas agendadas,{'\n'}
        as conversas aparecerão aqui
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('StudentBookings')}
      >
        <Text style={styles.emptyButtonText}>Ver minhas aulas</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando conversas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.bookingId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={items.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageIcon: {
    marginRight: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  closedSubtitle: {
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  statusIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  statusActive: {
    backgroundColor: colors.primary,
  },
  statusClosed: {
    backgroundColor: colors.textSecondary,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});