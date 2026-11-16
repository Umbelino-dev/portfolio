# Base de conhecimento do gato

Tudo que o assistente do site pode afirmar está nesta pasta. Nada fora dela.

**Esta pasta é pública** (o repositório é público) e vai inteira para o Google (Gemini) a cada pergunta. Só escreva aqui o que você aceita que qualquer pessoa leia.

Como funciona
- Um arquivo `.md` por assunto. Texto curto, uma ideia por linha, nas suas palavras.
- Uma linha com `[PREENCHER]` **não entra** no prompt: é lembrete do que falta.
- Comentários `<!-- assim -->` também não entram.
- Depois de editar: `npm run knowledge` (o build também roda isso sozinho).
- Fato sem fonte não entra. Rascunho não confirmado fica com `[PREENCHER]`.
