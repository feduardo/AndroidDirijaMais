import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput, IconButton, Avatar } from 'react-native-paper';
import MessageRepository, { MessageOut } from '@/infrastructure/repositories/MessageRepository';
import { colors } from '@/presentation/theme';
import { useAuthStore } from '@/presentation/state/authStore';


type Props = {
  route: {
    params: {
      bookingId: string;
    };
  };
};

export const StudentChatScreen = ({ route }: Props) => {
  const { bookingId } = route.params;
  const [messages, setMessages] = useState<MessageOut[]>([]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);
  const { user } = useAuthStore();
  const myUserId = user?.id;


  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await MessageRepository.listByBooking(bookingId, 100);
      setMessages(res.messages);
      setChatEnabled(res.chat_enabled);

      // marca como lidas (silencioso)
      if (res.messages.length > 0) {
        MessageRepository.markAsRead(bookingId).catch(() => {});
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!text.trim() || !chatEnabled || sending) return;

    try {
      setSending(true);
      const msg = await MessageRepository.send(bookingId, { content: text });
      setMessages((prev) => [...prev, msg]);
      setText('');
      
      // Scroll para o final após um breve delay
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    // Força interpretação como UTC
    const date = new Date(dateString + 'Z');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderMessage = ({ item }: { item: MessageOut }) => {

    const isSentByMe = myUserId ? item.sender_id === myUserId : false;

    return (
      <View style={[
        styles.messageRow,
        isSentByMe ? styles.sentRow : styles.receivedRow
      ]}>
        {/* Avatar para mensagens recebidas (esquerda) */}
        {!isSentByMe && (
          <Avatar.Text
            size={36}
            label="IN" // Iniciais do instrutor
            style={styles.otherAvatar}
          />
        )}
        
        {/* Balão da mensagem */}
        <View
          style={[
            styles.messageBubble,
            isSentByMe ? styles.sentBubble : styles.receivedBubble
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSentByMe ? styles.sentText : styles.receivedText
            ]}
          >
            {item.content}
          </Text>
          <Text style={styles.messageTime}>
            {formatTime(item.created_at)}
          </Text>
        </View>

        {/* Avatar para minhas mensagens (direita) */}
        {isSentByMe && (
          <Avatar.Text
            size={36}
            label="EU"
            style={styles.myAvatar}
          />
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>Nenhuma mensagem</Text>
      <Text style={styles.emptySubtitle}>
        Envie a primeira mensagem para iniciar a conversa
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando mensagens...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header simples */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversa</Text>
        <Text style={styles.headerSubtitle}>
          {chatEnabled ? 'Chat ativo' : 'Chat encerrado'}
        </Text>
      </View>

      {/* Lista de mensagens */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            setTimeout(() => {
              listRef.current?.scrollToEnd({ animated: false });
            }, 100);
          }
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Input de mensagem ou aviso de chat encerrado */}
      {!chatEnabled ? (
        <View style={styles.closedBox}>
          <Text style={styles.closedText}>
            💬 Chat encerrado. Apenas leitura disponível.
          </Text>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Digite sua mensagem..."
            style={styles.input}
            multiline
            maxLength={500}
            outlineColor={colors.outline}
            activeOutlineColor={colors.primary}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!text.trim() || sending) && styles.sendButtonDisabled
            ]}
            onPress={send}
            disabled={!text.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size={24} color="white" />
            ) : (
              <Text style={styles.sendButtonText}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  sentBubble: {
  backgroundColor: '#4A4A4A', // cinza escuro
  maxWidth: '70%',
  borderRadius: 16,
  padding: 12,
},

receivedBubble: {
  backgroundColor: '#E5E5E5', // cinza claro
  maxWidth: '70%',
  borderRadius: 16,
  padding: 12,
},

sentText: {
  color: '#FFFFFF', // branco fixo
  fontSize: 15,
},

receivedText: {
  color: '#000000', // preto fixo
  fontSize: 15,
},

messageTime: {
  marginTop: 4,
  fontSize: 11,
  color: '#888888',
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
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 16,
  },

messageRow: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  marginVertical: 6,
  paddingHorizontal: 12,
},
sentRow: {
  justifyContent: 'flex-end',
},
receivedRow: {
  justifyContent: 'flex-start',
},

  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 8,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },

  myAvatar: {
    backgroundColor: colors.primary,
  },
  otherAvatar: {
    backgroundColor: colors.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.outline || colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  sendButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  closedBox: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundSecondary || '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: colors.outline || colors.border,
    alignItems: 'center',
  },
  closedText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  
});