const chatbox = document.getElementById('chatbox');
const chatForm = document.getElementById('chat-form');
const inputMsg = document.getElementById('inputMsg');

// Função para adicionar mensagem ao chatbox
function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'bot-msg');
  msgDiv.textContent = text;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = inputMsg.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  inputMsg.value = '';
  inputMsg.disabled = true;

  try {
    const response = await fetch('https://n8n.diferro.com.br:5678/webhook-test/chat-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('Erro na comunicação com o servidor.');

    const data = await response.json();

    // Supondo que o n8n retorne no campo 'reply'
    addMessage(data.reply || 'Nenhuma resposta recebida.', 'bot');
  } catch (error) {
    addMessage('Erro ao enviar a mensagem. Tente novamente.', 'bot');
    console.error(error);
  } finally {
    inputMsg.disabled = false;
    inputMsg.focus();
  }
});
