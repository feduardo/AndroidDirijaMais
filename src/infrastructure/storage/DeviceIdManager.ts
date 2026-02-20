import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import SecureStorage from './SecureStorage';

/**
 * Gerencia o Device ID único do dispositivo.
 * 
 * IMPORTANTE:
 * - Device ID NÃO deve ser limpo no logout
 * - Só limpa em: reset manual, reinstalação do app
 * - Usado para: rate limiting, auditoria, antifraude
 * - Compatível com LGPD (não identifica usuário)
 */
class DeviceIdManager {
  private static instance: DeviceIdManager;
  private readonly DEVICE_ID_KEY = '@app:device_id';
  private deviceId: string | null = null;

  private constructor() {}

  static getInstance(): DeviceIdManager {
    if (!DeviceIdManager.instance) {
      DeviceIdManager.instance = new DeviceIdManager();
    }
    return DeviceIdManager.instance;
  }

  async getDeviceId(): Promise<string> {
    // Se já carregou na memória, retorna
    if (this.deviceId) {
      return this.deviceId;
    }

    // Tenta carregar do storage
    let storedId = await SecureStorage.getItem(this.DEVICE_ID_KEY);

    // Se não existe ou é inválido, gera novo
    if (!storedId || !uuidValidate(storedId)) {
      storedId = uuidv4();
      await SecureStorage.setItem(this.DEVICE_ID_KEY, storedId);
    }

    this.deviceId = storedId;
    return storedId;
  }

  /**
   * ATENÇÃO: NÃO usar no logout!
   * Só usar em casos específicos:
   * - Reset manual por suporte
   * - Migração de dados
   */
  async clearDeviceId(): Promise<void> {
    this.deviceId = null;
    await SecureStorage.removeItem(this.DEVICE_ID_KEY);
  }
}

export default DeviceIdManager.getInstance();