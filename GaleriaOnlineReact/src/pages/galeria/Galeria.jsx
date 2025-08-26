import './Galeria.css'; // Importa o CSS da Galeria
import icon from "./../../assets/img/upload.svg"; // Importa o ícone de upload
import { Botao } from '../../components/botao/Botao'; // Importa componente Botao
import { Card } from '../../components/card/Card'; // Importa componente Card
import { useEffect, useState, useRef } from 'react'; // Importa hooks do React
import api from '../../Services/services'; // Importa instância do Axios para chamadas API

export const Galeria = () => {
  // Estados principais
  const [cards, setCards] = useState([]); // Armazena os cards da galeria
  const [imagem, setImagem] = useState(null); // Armazena o arquivo selecionado para cadastro
  const [nomeImagem, setNomeImagem] = useState(""); // Armazena o nome da imagem para cadastro

  // Ref e estados para edição de card
  const editarInputRef = useRef(null); // Ref para o input oculto de edição
  const [editarId, setEditarId] = useState(null); // ID do card sendo editado
  const [novoNomeEditar, setNovoNomeEditar] = useState(""); // Novo nome do card

  // Função para listar todos os cards da API
  async function listarCards() {
    try {
      const resposta = await api.get("Imagem"); // Chama GET /Imagem
      setCards(resposta.data); // Atualiza estado com os cards recebidos
    } catch (error) {
      console.error(error);
      alert("Erro ao listar."); // Alerta caso haja erro
    }
  }

  // Função para cadastrar um novo card
  async function cadastrarCard(e) {
    e.preventDefault(); // Evita recarregar a página no submit
    if (imagem && nomeImagem) { // Checa se os campos estão preenchidos
      try {
        const formData = new FormData(); // Cria FormData para enviar arquivo
        formData.append("Nome", nomeImagem); // Adiciona nome
        formData.append("Arquivo", imagem); // Adiciona arquivo

        // Envia POST para API
        await api.post('Imagem/upload', formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        alert("Cadastro concluído com sucesso!"); // Confirmação
        setImagem(null); // Limpa o input de imagem
        setNomeImagem(""); // Limpa o input de nome
        listarCards(); // Atualiza lista de cards
      } catch (error) {
        console.error(error);
        alert("Não foi possível realizar o cadastro."); // Mensagem de erro
      }
    } else {
      alert("Preencha os campos de Nome e Imagem!"); // Alert caso algum campo vazio
    }
  }

  // Função para iniciar edição de um card
  function editarCard(id, nomeAntigo) {
    const novoNome = prompt("Digite o novo nome da imagem:", nomeAntigo); // Solicita novo nome
    if (!novoNome) return; // Sai se usuário cancelar
    setEditarId(id); // Salva id do card a ser editado
    setNovoNomeEditar(novoNome); // Salva novo nome
    editarInputRef.current.value = null; // Limpa seleção anterior
    editarInputRef.current.click(); // Abre o file chooser do input oculto
  }

  // Função chamada quando usuário seleciona arquivo para edição
  async function handleEditarInput(e) {
    const arquivo = e.target.files[0]; // Pega o arquivo selecionado
    if (!arquivo) return; // Sai se nenhum arquivo

    const formData = new FormData(); // Cria FormData
    formData.append("Nome", novoNomeEditar); // Adiciona novo nome
    formData.append("Arquivo", arquivo); // Adiciona arquivo

    try {
      // Envia PUT para API usando o id correto
      await api.put(`Imagem/${editarId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Edição realizada com sucesso! 😁✨"); // Confirmação
      listarCards(); // Atualiza lista de cards
      setEditarId(null); // Limpa id de edição
      setNovoNomeEditar(""); // Limpa novo nome
    } catch (error) {
      console.error(error);
      alert("Não foi possível editar o card!"); // Mensagem de erro
    }
  }

  // Função para excluir card
  async function excluirCard(id) {
    try {
      await api.delete(`Imagem/${id}`); // Chama DELETE /Imagem/:id
      alert("Card excluído com sucesso!"); // Confirmação
      listarCards(); // Atualiza lista de cards
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o card!"); // Mensagem de erro
    }
  }

  // Hook useEffect para listar cards ao carregar o componente
  useEffect(() => {
    listarCards();
  }, []);

  return (
    <>
      <h1 className='tituloGaleria'>Galeria Online</h1>

      {/* Formulário de cadastro */}
      <form className='formulario' onSubmit={cadastrarCard}>
        <div className='campoNome'>
          <label>Nome</label>
          <input
            type="text"
            className='inputNome'
            value={nomeImagem}
            onChange={(e) => setNomeImagem(e.target.value)} // Atualiza estado
          />
        </div>

        <div className='campoImagem'>
          <label className='arquivoLabel'>
            <i><img src={icon} alt="Ícone de upload de imagem" /></i>
            <input
              type="file"
              className="arquivoInput"
              onChange={(e) => setImagem(e.target.files[0])} // Atualiza estado
            />
          </label>
        </div>

        <Botao nomeBotao="Cadastrar" /> {/* Botão de enviar */}
      </form>

      {/* Input oculto usado para edição de arquivo */}
      <input
        type="file"
        ref={editarInputRef} // Ref para acessar input
        style={{ display: 'none' }} // Oculto
        accept="image/*" // Aceita apenas imagens
        onChange={handleEditarInput} // Chamada quando arquivo selecionado
      />

      {/* Lista de cards */}
      <div className='campoCards'>
        {cards.length > 0 ? (
          cards.map((e) => (
            <Card
              key={e.id}
              tituloCard={e.nome}
              imgCard={`https://localhost:7019/${e.caminho.replace("wwwroot/", "")}`} // Mostra imagem
              funcaoEditar={() => editarCard(e.id, e.nome)} // Passa id e nome para edição
              funcaoExcluir={() => excluirCard(e.id)} // Passa id para exclusão
            />
          ))
        ) : (
          <p>Nenhum Card cadastrado</p>
        )}
      </div>
    </>
  );
};
