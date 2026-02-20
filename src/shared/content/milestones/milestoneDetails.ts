export interface MilestoneDetail {
  title: string;
  description: string;
  tips: string[];
  estimatedTime?: string;
  cost?: string;
  hasInstructorSearch?: boolean;
}

export const milestoneDetails: Record<string, MilestoneDetail> = {
  ACCOUNT_CREATED: {
    title: 'Conta gov.br Criada',
    description: 'A conta gov.br é sua porta de entrada para todos os serviços digitais do governo federal, incluindo o aplicativo CNH Brasil.',
    tips: [
      'Baixe o aplicativo CNH Brasil (Google Play ou App Store)',
      'Faça login com sua conta gov.br',
      'Seus dados pessoais serão recuperados automaticamente',
      'Mantenha seus dados atualizados'
    ],
    estimatedTime: '10 minutos',
    cost: 'Gratuito'
  },

  PROCESS_OPENED: {
    title: 'Processo Aberto no CNH Brasil',
    description: 'Abertura oficial do seu processo de habilitação. Aqui você escolhe a categoria (carro e/ou moto) e o estado onde fará os exames.',
    tips: [
      'Acesse a área "Condutor" no app CNH Brasil',
      'Selecione "Requerimento da Primeira Habilitação"',
      'Escolha a categoria desejada (A para moto, B para carro)',
      'Confirme a unidade federativa dos exames'
    ],
    estimatedTime: '15 minutos',
    cost: 'Gratuito'
  },

  BIOMETRIC_COLLECTED: {
    title: 'Coleta Biométrica',
    description: 'Registro das suas impressões digitais e foto no sistema do Detran. Etapa obrigatória e presencial.',
    tips: [
      'Agende no site ou app do Detran do seu estado',
      'Leve documento de identidade com foto',
      'Processo rápido, geralmente 15-20 minutos',
      'Verifique os horários disponíveis com antecedência'
    ],
    estimatedTime: '1 dia',
    cost: 'Incluído nas taxas do Detran'
  },

  MEDICAL_EXAM_SCHEDULED: {
    title: 'Exame Médico Agendado',
    description: 'Agende seu exame de aptidão física e mental. Obrigatório para verificar se você está apto para dirigir.',
    tips: [
      'Procure clínicas credenciadas pelo Detran',
      'Leve RG, CPF e comprovante de residência',
      'Exame avalia visão, audição e condições físicas gerais',
      'Em caso de uso de óculos/lentes, leve-os'
    ],
    estimatedTime: '30 minutos',
    cost: 'R$ 200 - R$ 300'
  },

  MEDICAL_EXAM_APPROVED: {
    title: 'Aptidão Física e Mental Aprovada',
    description: 'Você foi aprovado no exame médico! Agora pode prosseguir para a avaliação psicológica.',
    tips: [
      'Guarde o comprovante do exame',
      'Validade geralmente de 1 ano',
      'Se reprovado, pode refazer após tratamento adequado'
    ],
    estimatedTime: 'Imediato',
    cost: 'Já pago'
  },

  PSYCHOLOGICAL_APPROVED: {
    title: 'Avaliação Psicológica Aprovada',
    description: 'Avaliação que verifica suas condições psicológicas para dirigir com segurança.',
    tips: [
      'Realize em clínica credenciada pelo Detran',
      'Testes avaliam atenção, memória e equilíbrio emocional',
      'Seja sincero nas respostas',
      'Não há "resposta certa", apenas adequação ao perfil'
    ],
    estimatedTime: '1-2 horas',
    cost: 'R$ 150 - R$ 250'
  },

  THEORY_COURSE_STARTED: {
    title: 'Curso Teórico Iniciado',
    description: 'Curso gratuito online oferecido pelo Ministério dos Transportes sobre legislação, direção defensiva e primeiros socorros.',
    tips: [
      'Acesse pelo app CNH Brasil ou site da Senatran',
      'Conteúdo em vídeos, podcasts e textos',
      'Estude no seu ritmo, sem carga horária mínima',
      'Faça anotações dos pontos importantes'
    ],
    estimatedTime: 'Flexível (recomendado 20-30 horas)',
    cost: 'Gratuito'
  },

  THEORY_COURSE_COMPLETED: {
    title: 'Curso Teórico Concluído',
    description: 'Parabéns! Você completou o curso teórico. O certificado foi registrado automaticamente no sistema.',
    tips: [
      'Certificado emitido automaticamente',
      'Material continua disponível para revisão',
      'Use simulados para testar conhecimento',
      'Agora você pode agendar a prova teórica'
    ],
    estimatedTime: 'Automático',
    cost: 'Gratuito'
  },

  THEORY_EXAM_SCHEDULED: {
    title: 'Prova Teórica Agendada',
    description: 'Agende sua prova teórica no Detran. São 30 questões de múltipla escolha, precisando de 20 acertos para aprovação.',
    tips: [
      'Revise o conteúdo do curso teórico',
      'Faça simulados online',
      'Prova unificada em todo Brasil',
      'Primeira reprovação não paga nova taxa',
      'Foque em legislação e direção defensiva'
    ],
    estimatedTime: '1 hora (duração da prova)',
    cost: 'Incluído nas taxas'
  },

  THEORY_EXAM_APPROVED: {
    title: 'Prova Teórica Aprovada',
    description: 'Excelente! Você foi aprovado na prova teórica. Agora pode iniciar as aulas práticas com um instrutor credenciado.',
    tips: [
      'Guarde o comprovante de aprovação',
      'Pode iniciar aulas práticas',
      'Escolha um instrutor autônomo credenciado',
      'Mínimo de 2 aulas práticas obrigatórias'
    ],
    estimatedTime: 'Imediato',
    cost: 'Já pago',
    hasInstructorSearch: true
  },

  DRIVING_SCHOOL_ENROLLED: {
    title: 'Instrutor Escolhido',
    description: 'Escolha um instrutor autônomo credenciado pelo Detran para suas aulas práticas. Todos os instrutores são verificados e certificados.',
    tips: [
      'Verifique se o instrutor está credenciado no Detran',
      'Compare preços e avaliações',
      'Novo modelo: mínimo de 2 aulas obrigatórias',
      'Pode agendar aulas extras se necessário',
      'Todos os instrutores têm certificação oficial'
    ],
    estimatedTime: '1 dia',
    cost: 'Variável',
    hasInstructorSearch: true
  },

  PRACTICAL_CLASSES_STARTED: {
    title: 'Aulas Práticas Iniciadas',
    description: 'Comece suas aulas práticas de direção. Com a nova resolução, apenas 2 aulas são obrigatórias, mas você pode fazer quantas precisar.',
    tips: [
      'Pode usar carro próprio (sem duplo comando obrigatório)',
      'Mínimo de 2 aulas obrigatórias',
      'Aulas extras custam R$ 75-120 cada',
      'Foque em manobras básicas e segurança',
      'Pratique estacionamento e baliza'
    ],
    estimatedTime: '2+ horas',
    cost: 'R$ 150-250 (2 aulas) + extras',
    hasInstructorSearch: true
  },

  PRACTICAL_CLASSES_COMPLETED: {
    title: 'Aulas Práticas Concluídas',
    description: 'Você completou as aulas práticas obrigatórias. Agora pode agendar o exame prático de direção.',
    tips: [
      'Certifique-se de estar confiante',
      'Considere aulas extras se necessário',
      'Revise manobras e regras de trânsito',
      'Agende a prova quando se sentir preparado'
    ],
    estimatedTime: 'Imediato',
    cost: 'Já pago'
  },

  PRACTICAL_EXAM_SCHEDULED: {
    title: 'Exame Prático Agendado',
    description: 'Última etapa! O exame prático avalia manobras, domínio do veículo e condução segura. Agora é por pontuação (começa com 100, reprova com mais de 10 pontos negativos).',
    tips: [
      'Pode usar seu próprio carro na prova',
      'Sistema de pontuação: não elimina por erro único',
      'Reprova com mais de 10 pontos perdidos',
      'Faltas leves: 3 pontos, médias: 5, graves: 8',
      'Descanse bem na véspera',
      'Chegue com antecedência'
    ],
    estimatedTime: '30-40 minutos',
    cost: 'Incluído (R$ 80-150 se reprovar)'
  },

  PRACTICAL_EXAM_APPROVED: {
    title: 'Exame Prático Aprovado',
    description: 'Parabéns! Você foi aprovado no exame prático. Agora receberá a Permissão para Dirigir (PPD).',
    tips: [
      'PPD válida por 1 ano',
      'Após 1 ano sem infrações graves, recebe CNH definitiva',
      'Dirija com cuidado e respeite as leis',
      'CNH digital disponível no app'
    ],
    estimatedTime: 'Até 7 dias',
    cost: 'Incluído'
  },

  PPD_ISSUED: {
    title: 'PPD Emitida',
    description: 'Sua Permissão para Dirigir foi emitida! Válida por 1 ano, após esse período sem infrações graves você receberá a CNH definitiva.',
    tips: [
      'PPD tem mesma validade que CNH',
      'Evite infrações graves no primeiro ano',
      'Infrações leves/médias não impedem CNH definitiva',
      'Acompanhe pelo app CNH Brasil'
    ],
    estimatedTime: 'Imediato',
    cost: 'Incluído'
  },

  DIGITAL_CNH_DOWNLOADED: {
    title: 'CNH-e Baixada',
    description: 'Você baixou a versão digital da sua habilitação! A CNH-e tem a mesma validade jurídica da versão física.',
    tips: [
      'CNH digital tem mesma validade que física',
      'Aceita em todo território nacional',
      'Mantenha o app atualizado',
      'Sempre carregue o celular ao dirigir'
    ],
    estimatedTime: 'Imediato',
    cost: 'Gratuito'
  }
};