# OldModeno - Treinamento de Toque Suave para Smartphones

Um aplicativo acolhedor, acessível e intuitivo especialmente concebido para ensinar pessoas idosas a interagirem com a tela do smartphone sem aplicar força desnecessária, desenvolvendo a sensibilidade do toque leve e a confiança digital.

---

> [!IMPORTANT]
> **Requisitos e Decisões Atualizadas:**
> - **Navegação Vertical por Deslizar:** O usuário pode transicionar entre os desafios arrastando a tela para cima (*vertical swipe* suave) ou pelos controles visuais acessíveis de navegação.
> - **Interação Ilimitada:** Cada desafio pode ser praticado quantas vezes o idoso desejar, sem contagem regressiva punitiva ou limite de tentativas.
> - **Regra de Desbloqueio e Persistência:** O progresso é salvo automaticamente no `localStorage` do navegador a cada etapa concluída. O desafio seguinte só é liberado após o término bem-sucedido do desafio anterior. Todos os desafios já vencidos ficam livres para revisitar e praticar.
> - **Arquitetura 100% Client-Side:** Sem backend e sem banco de dados externo. Construído puramente com React 19, TypeScript e Tailwind CSS com modularidade e separação estrita de responsabilidades.
> - **Sensibilidade do Toque:** Tolerância gentil de 500ms para toque leve na bolha. Se segurar além desse tempo, a bolha vibra e treme com aviso pedagógico amigável.

---

## 1. Visão Geral dos 5 Desafios do MVP

```
┌────────────────────────────────────────────────────────────────────────┐
│             ESTRUTURA VERTICAL DE DESAFIOS (DESLIZAR P/ CIMA)          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Arrastar a Tela para o Lado (Cada tela possui sua própria cor,      │
│    que assume o fundo de todo o aplicativo)                            │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Carregar Barra (Segurar para encher; ao chegar no topo esvazia)     │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Estourar a Bolha (Toque rápido ≤ 500ms; se segurar ela treme)       │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Estourar Várias Bolhas (Vários tamanhos, mesma regra de toque leve) │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Espaço Integrado / Playground (Todos os exercícios em um só lugar)  │
└────────────────────────────────────────────────────────────────────────┘
```

### Detalhamento dos Desafios:
1. **Desafio 1 - Arrastar a Tela para o Lado:**
   - Ensina o deslize horizontal do dedo. 
   - Ao puxar para a direita ou esquerda, os cartões coloridos deslizam e a cor selecionada (Azul Céu, Menta Suave, Lavanda, Sol da Manhã) passa a colorir o plano de fundo do aplicativo como um todo.
   - O idoso ganha a percepção visual de que o toque não precisa de pressão para comandar a tela.

2. **Desafio 2 - Carregar Barra:**
   - Ensina o toque contínuo proposital.
   - O usuário toca e segura o botão/área de recarga. A barra se preenche com animação fluida e som harmônico crescente.
   - Ao atingir 100%, ela inicia o esvaziamento suave, ensinando a percepção de quando soltar o dedo.
   - Conclusão comemorativa após carregar a barra com sucesso, liberando o Desafio 3.

3. **Desafio 3 - Estourar a Bolha:**
   - O núcleo do treino contra a força excessiva.
   - Bolha central translúcida e suave.
   - Toque rápido (≤ 500ms): estouro festivo com som suave de *pop*, efeito de partículas e vibração tátil.
   - Toque pesado / segurado (> 500ms): a bolha fica laranja/âmbar, treme suavemente (*shake*) e exibe o texto explicativo em tamanho grande: *"Não precisa apertar com força! Apenas dê um toquezinho rápido e retire o dedo."*

4. **Desafio 4 - Estourar Várias Bolhas:**
   - Diversas bolhas de diâmetros variados flutuam na tela.
   - Estimula a coordenação motora e reafirma o hábito do toque leve em alvos diferentes.
   - Contador visual encorajador: *"5 bolhas estouradas com toque suave!"*.

5. **Desafio 5 - Espaço Integrado (Playground de Prática Livre):**
   - Um espaço completo combinando:
     - Gestos de deslizar para escolher a cor de fundo do app;
     - Bolhas flutuantes com o medidor de toque;
     - A barra de energia para praticar segurar e soltar;
     - Um velocímetro que informa a duração de cada toque em milissegundos, com o selo *"Toque Perfeito!"*.

---

## 2. Experiência do Usuário e Design Sênior

### Navegação por Arrastar para Cima e Controles Acessíveis
- **Deslizar para Cima:** O usuário pode deslizar o dedo para cima a qualquer momento para avançar para o próximo desafio (desde que já esteja desbloqueado).
- **Indicador de Deslize:** Seta animada suave no rodapé indicando *"Deslize para cima para o próximo exercício"* assim que a meta do exercício for batida.
- **Botões Grandes Alternativos:** Para garantir acessibilidade a quem tiver dificuldade com o gesto de deslizar, haverá sempre botões táteis proeminentes de *"Próximo"* e *"Exercício Anterior"*.
- **Prática Sem Limite:** Um botão bem visível de *"Praticar Novamente"* permite reiniciar qualquer desafio quantas vezes quiser.

### Feedback Sensorial e Acessibilidade
- **Som Sintetizado (Web Audio API):** Áudio 100% nativo gerado por osciladores no navegador, garantindo resposta instantânea e ausência de falhas de carregamento de rede.
- **Vibração Tátil:** Haptic feedback via `navigator.vibrate` nos momentos de acerto e de aviso de toque forte.
- **Tipografia e Contraste:** Textos claros em fontes legíveis, com contraste que atende WCAG AAA, sem elementos em formato de pílulas confusas ou textos diminutos.

---

## 3. Arquitetura Modular e Estrutura de Código

### Estrutura de Pastas Planejada (Sem Backend)
```
src/
├── types/
│   └── index.ts                 # Tipos dos desafios, estados de progresso e eventos
├── utils/
│   ├── sound.ts                 # Web Audio API (pop, chimes, haptics)
│   └── storage.ts               # Gerenciamento de persistência segura no localStorage
├── hooks/
│   ├── useProgress.ts           # Hook de desbloqueio sequencial e progresso
│   └── useSwipeGesture.ts       # Hook de detecção de gestos (vertical e horizontal)
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Barra superior com título e indicador de desafio
│   │   ├── NavigationDots.tsx   # Indicadores verticais de progresso da trilha
│   │   └── CongratsModal.tsx    # Modal de celebração e incentivo
│   └── challenges/
│       ├── SwipeChallenge.tsx   # Desafio 1: Arrastar para o lado & cor de fundo
│       ├── HoldBarChallenge.tsx # Desafio 2: Segurar e esvaziar barra
│       ├── BubbleChallenge.tsx  # Desafio 3: Estourar bolha única com toque leve
│       ├── MultiBubbleChallenge.tsx # Desafio 4: Múltiplas bolhas de vários tamanhos
│       └── PlaygroundChallenge.tsx  # Desafio 5: Espaço integrado completo
├── App.tsx                      # Orquestrador central e gerenciador de cor global
├── main.tsx                     # Ponto de entrada React
└── index.css                    # Estilos Tailwind e animações de tremor
```

### Regras de Negócio e Estado
- **Modelo de Progresso:**
  ```typescript
  interface AppProgress {
    unlockedStep: number; // 1 a 5
    completedSteps: number[]; // [1, 2, ...]
    currentThemeColor: string; // Cor de fundo ativa herdada do Desafio 1
  }
  ```
- **Persistência Imediata:** A cada desafio concluído com sucesso, o hook `useProgress` invoca `storage.saveProgress()`. Ao recarregar a página, o estado é restaurado integralmente.
- **Bloqueio Rígido:** O gesto de avançar para cima ou o clique no próximo desafio só é permitido se `step <= unlockedStep`. Se o usuário tentar arrastar antes de terminar, um aviso afetuoso diz: *"Complete este exercício primeiro para liberar o próximo!"*.

---

## 4. Etapas de Execução Após Aprovação

1. **Configuração Inicial:** Atualização de metadados (`metadata.json` e `index.html`) para *"OldModeno - Prática de Toque para Idosos"*.
2. **Camada de Utilitários (`utils/sound.ts` e `utils/storage.ts`):** Sintetizador sonoro Web Audio e camada de armazenamento local.
3. **Componentes dos 5 Desafios:** Desenvolvimento modular de cada um dos 5 desafios com os tratamentos de `pointerdown`, temporizador de 500ms, animação de tremor e transições suaves.
4. **Orquestrador de Navegação Vertical:** Suporte a gesto de deslizar para cima (`useSwipeGesture`) com transição de tela por Framer Motion.
5. **Verificação e Testes de Compilação:** Executar `compile_applet` para assegurar build 100% livre de erros TypeScript e linting.
