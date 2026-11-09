/*
 * NotPaper Hub — CONTEÚDO E LINKS
 * ------------------------------------------------------------------
 * Este é o ÚNICO arquivo que precisa ser editado para trocar textos,
 * links ou o tempo de retorno automático. O banner e o app usam o
 * mesmo conteúdo.
 *
 * Links: NotPaper Gestor = arlindoacneto.github.io/notpaper-gestao-municipal (projeto design modernista, versão PÚBLICA)
 *        NotPaper (workflow, processos, assinatura, IA) e GED = notpaper.notpaper.com.br
 * "url": botão "Acessar o sistema" (vazio = oculto).
 * "video": botão "Assistir ao vídeo" (arquivo dentro de assets/video, funciona offline).
 */
window.HUB_CONFIG = {
  marca: "NotPaper Hub",
  selo: "UM HUB. SETE FRENTES. ZERO PAPEL.",
  frase: "Onde o papel termina, a gestão inteligente começa.",
  subfrase: "IA, automação e validade jurídica integradas — o que há de mais moderno em gestão pública.",
  rodape: "notpaper.com.br · assinador.silosign.com.br",
  dica: "Toque em uma solução para conhecer",

  // Segundos sem toque até voltar sozinho para a tela inicial (0 = desliga)
  retornoAutomaticoHub: 75,
  // Segundos sem toque dentro de um sistema aberto até voltar ao HUB (0 = desliga)
  retornoAutomaticoSistema: 240,

  frentes: [
    {
      id: "gestor",
      nome: "NotPaper Gestor",
      sub: "Todas as secretarias em uma base",
      destaque: "LANÇAMENTO",
      icone: "gestor",
      resumo:
        "Sistemas que conversam. Gestão que enxerga. O modelo de integração que reúne os dados de todas as secretarias em um banco consolidado e os documentos em um data lake — a mesma base oficial atende o munícipe pelo Omnichannel e o gestor na tomada de decisão.",
      itens: [
        "Banco consolidado com os dados de todas as secretarias",
        "Data lake dos documentos, com origem e responsável identificados",
        "Uma base para dois usos: Omnichannel para o munícipe e painel para a gestão",
        "O prefeito pergunta, a base responde: consultas em linguagem natural por secretaria"
      ],
      base: "",
      url: "https://arlindoacneto.github.io/notpaper-gestao-municipal/" // projeto design modernista (versão pública)
    },
    {
      id: "ecm",
      nome: "NotPaper",
      sub: "ECM, Workflow e Automação",
      icone: "ecm",
      resumo:
        "Menos papel. Mais cidade. Plataforma ECM e Workflow que transforma processos em papel em fluxos digitais rastreáveis, com BPMN 2.0 governando a Inteligência Artificial e o App do Cidadão.",
      itens: [
        "Modelagem e execução de processos em BPMN 2.0",
        "Tramitação com prazos, alçadas e trilha de auditoria",
        "IA governada pelo processo: classifica, analisa e sugere encaminhamento",
        "App do Cidadão: serviços, agendamentos e acompanhamento — pediu, acompanhou, resolveu"
      ],
      base: "Lei nº 14.129/2021 — Governo Digital",
      url: "https://notpaper.notpaper.com.br"
    },
    {
      id: "sign",
      nome: "SiloSign",
      sub: "Portal de Assinaturas",
      icone: "sign",
      resumo:
        "Assinar com validade jurídica, sem imprimir e sem deslocamento. Mais de 500 mil documentos já assinados — integrado aos fluxos do NotPaper.",
      itens: [
        "Assinatura eletrônica simples, avançada e qualificada (ICP-Brasil)",
        "Padrão PAdES, até 20 assinantes por documento",
        "Prova de vida e Pix",
        "Integração nativa com processos e GED"
      ],
      base: "Lei nº 14.063/2020 · MP nº 2.200-2/2001",
      url: "https://assinador.silosign.com.br"
    },
    {
      id: "cert",
      nome: "SiloCert",
      sub: "Certificados Digitais",
      icone: "cert",
      resumo:
        "A identidade digital que dá peso de assinatura de próprio punho. Emissão e revenda de certificado digital ICP-Brasil, resolvidas na mesma casa.",
      itens: [
        "Certificados e-CPF e e-CNPJ ICP-Brasil",
        "Validade, renovação e uso com alerta e trilha completa",
        "Base para assinatura qualificada no SiloSign",
        "Apoio na emissão e instalação"
      ],
      base: "MP nº 2.200-2/2001 — ICP-Brasil",
      url: "https://arinprint.acsoluti.com.br" // SiloCert: AR Inprint na AC Soluti
    },
    {
      id: "ged",
      nome: "NotPaper GED",
      sub: "Digitalização com validade jurídica",
      icone: "ged",
      resumo:
        "Do arquivo morto ao acervo vivo. Digitalização conforme o Decreto nº 10.278/2020, que garante ao documento digitalizado o mesmo valor legal do original em papel.",
      itens: [
        "Metadados e conferência por assinatura ICP-Brasil",
        "Extração de conteúdo (OCR) e busca instantânea",
        "Controle de acesso, versões e trilha de auditoria",
        "Temporalidade e destinação conforme a tabela do órgão"
      ],
      base: "Decreto nº 10.278/2020 · Lei nº 12.682/2012",
      url: "https://notpaper.notpaper.com.br"
    },
    {
      id: "omni",
      nome: "NotPaper Omnichannel",
      sub: "Telefone, WhatsApp e Portal integrados",
      icone: "omni",
      resumo:
        "A inteligência municipal começa no atendimento. Qualquer canal, o mesmo processo: a IA responde com base em conteúdo oficial e o pedido já entra no workflow com protocolo, com os dados oficiais da prefeitura integrados na nuvem Oracle.",
      itens: [
        "Atendimento por voz e WhatsApp com IA, em diferentes idiomas",
        "Respostas apoiadas na Carta de Serviços homologada, com fonte",
        "Documentos e protocolo entram direto no processo; o cidadão é avisado a cada etapa",
        "O servidor recebe o caso com contexto quando a análise humana é necessária"
      ],
      base: "",
      url: "",
      video: "assets/video/omnichannel.mp4",
      poster: "assets/video/omnichannel-poster.jpg"
    },
    {
      id: "dev",
      nome: "Desenvolvimento Sob Medida",
      sub: "Aplicações para desafios específicos",
      icone: "code",
      resumo:
        "Quando nenhuma solução padrão atende, nós desenvolvemos. Criamos aplicações específicas para resolver problemas particulares da gestão pública, integradas à plataforma NotPaper e com a mesma governança de processo, assinatura e documento.",
      itens: [
        "Diagnóstico do problema e desenho da solução junto à equipe do órgão",
        "Aplicação web e mobile feita para a realidade de cada gestão",
        "Integração com sistemas legados, bases de dados e a plataforma NotPaper",
        "Implantação, treinamento e sustentação pela mesma equipe"
      ],
      casosTitulo: "Soluções em operação",
      casos: [
        { nome: "Ministério da Agricultura e Pecuária", desc: "Athena: solução desenvolvida sob medida para o ministério", url: "https://athena.agro.gov.br", imagem: "assets/img/athena.jpg" },
        { nome: "Secretaria Municipal de Cultura e Economia Criativa de São Paulo", desc: "Solução customizada para a gestão da secretaria", imagem: "assets/img/smc-sp.jpg" }
      ],
      base: "",
      url: "https://athena.agro.gov.br",
      rotuloUrl: "Ver o Athena (MAPA)"
    }
  ]
};
