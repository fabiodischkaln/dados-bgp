// api/suggest.js
// Esta função roda no servidor da Vercel — a chave da Anthropic fica invisível

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { review, empresa } = req.body;

  if (!review || !empresa) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const prompt = `Você é especialista em gestão de reputação online. Escreva uma resposta profissional, empática e personalizada para esta avaliação do Google Meu Negócio da empresa "${empresa}".

Avaliação: ${review.nota} estrelas
Comentário: "${review.comentario || 'Sem comentário escrito'}"
Autor: ${review.autor || 'cliente'}

Regras:
- Tom cordial e humano
- Máximo 3 frases
- Não seja genérico
- Se for negativa (1-2 estrelas), demonstre preocupação genuína
- Se for positiva (4-5 estrelas), agradeça com entusiasmo
- Termine convidando para voltar ou para contato
- Responda em português brasileiro`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // ← vem da variável de ambiente
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // modelo mais barato para sugestões
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Não foi possível gerar sugestão.';
    res.status(200).json({ suggestion: text });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao contatar IA: ' + e.message });
  }
}
