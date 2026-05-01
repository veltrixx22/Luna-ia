const urgentSignals = ['desmaio', 'sangramento muito intenso', 'dor insuportável', 'febre', 'gravidez', 'teste positivo', 'mau cheiro', 'infecção', 'vômito', 'emergência'];

export function getLocalLunaResponse(input: string): string {
  const text = input.toLowerCase();
  const disclaimer = '\n\nLembrete: a Luna AI oferece informações educativas e não substitui avaliação médica.';

  if (urgentSignals.some((signal) => text.includes(signal))) {
    return 'Sinto muito que você esteja passando por isso. Pelo que você descreveu, o mais seguro é procurar atendimento médico ou uma unidade de saúde, principalmente se houver dor forte, desmaio, febre, sangramento fora do comum, suspeita de gravidez ou sinais de infecção.' + disclaimer;
  }

  if (text.includes('cólica') || text.includes('colica') || text.includes('dor')) {
    return 'Cólicas podem acontecer antes ou durante a menstruação, mas a intensidade importa. Você pode registrar o nível da dor aqui na Luna AI para perceber padrões. Se a dor for forte, frequente, impedir sua rotina ou vier com febre/sangramento incomum, procure um profissional de saúde.' + disclaimer;
  }

  if (text.includes('atras') || text.includes('menstruação atrasada') || text.includes('menstruacao atrasada')) {
    return 'Atrasos podem acontecer por estresse, mudanças de rotina, sono, alimentação, variações hormonais ou risco de gravidez. A previsão da Luna AI é apenas uma estimativa baseada nos dados informados. Se houve relação com risco de gravidez, considere fazer um teste no tempo adequado e buscar orientação profissional.' + disclaimer;
  }

  if (text.includes('ovula') || text.includes('fértil') || text.includes('fertil')) {
    return 'A ovulação costuma ser estimada cerca de 14 dias antes da próxima menstruação. A janela fértil geralmente inclui os 5 dias antes da ovulação e até 1 dia depois. Isso é uma estimativa, especialmente em ciclos irregulares.' + disclaimer;
  }

  if (text.includes('fluxo') || text.includes('sangramento')) {
    return 'O fluxo menstrual pode variar entre leve, médio e intenso. Registre a intensidade para acompanhar mudanças. Se você encharca absorventes muito rápido, tem tontura, coágulos grandes ou sangramento fora do período, procure atendimento médico.' + disclaimer;
  }

  if (text.includes('humor') || text.includes('irritada') || text.includes('ansiosa') || text.includes('triste')) {
    return 'Mudanças de humor podem aparecer em algumas fases do ciclo. Registrar humor, sono, cólicas e sintomas ajuda a identificar padrões. Se a tristeza, ansiedade ou irritação estiverem muito fortes ou persistentes, buscar apoio profissional pode ajudar bastante.' + disclaimer;
  }

  if (text.includes('sintoma') || text.includes('inchaço') || text.includes('acne') || text.includes('náusea') || text.includes('nausea')) {
    return 'Você pode registrar sintomas como inchaço, acne, dor de cabeça, náusea, sensibilidade nos seios e cansaço. Com o tempo, a Luna AI ajuda a enxergar padrões do seu ciclo. Sintomas fortes, novos ou preocupantes merecem orientação de um profissional de saúde.' + disclaimer;
  }

  if (text.includes('ciclo')) {
    return 'O ciclo menstrual é contado do primeiro dia da menstruação até o dia anterior à próxima. Muitas pessoas têm ciclos próximos de 28 dias, mas variações são comuns. Se o ciclo for muito irregular ou mudar de repente, vale conversar com um ginecologista.' + disclaimer;
  }

  return 'Posso te ajudar com explicações sobre ciclo menstrual, cólicas, atraso, período fértil, ovulação, fluxo, sintomas e humor. Para começar, me conte o que você está sentindo ou qual dúvida quer entender melhor.' + disclaimer;
}
