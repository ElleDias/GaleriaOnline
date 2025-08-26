import './Galeria.css';
import icon from "./../../assets/img/upload.svg";
import { Botao } from '../../components/botao/Botao';
import { Card } from '../../components/card/Card';
import { useEffect, useState, useRef } from 'react';
import api from '../../Services/services';

export const Galeria = () => {
  const [cards, setCards] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [nomeImagem, setNomeImagem] = useState("");
  
  // Ref para o input de edição
  const editarInputRef = useRef(null);
  const [editarId, setEditarId] = useState(null);
  const [novoNomeEditar, setNovoNomeEditar] = useState("");

  // Lista todos os cards
  async function listarCards() {
    try {
      const resposta = await api.get("Imagem");
      setCards(resposta.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao listar.");
    }
  }

  // Cadastrar Card
  async function cadastrarCard(e) {
    e.preventDefault();
    if (imagem && nomeImagem) {
      try {
        const formData = new FormData();
        formData.append("Nome", nomeImagem);
        formData.append("Arquivo", imagem);

        await api.post('Imagem/upload', formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        alert("Cadastro concluído com sucesso!");
        setImagem(null);
        setNomeImagem("");
        listarCards();

      } catch (error) {
        console.error(error);
        alert("Não foi possível realizar o cadastro.");
      }
    } else {
      alert("Preencha os campos de Nome e Imagem!");
    }
  }

  // Preparar edição de card
  function editarCard(id, nomeAntigo) {
    const novoNome = prompt("Digite o novo nome da imagem:", nomeAntigo);
    if (!novoNome) return;
    setEditarId(id);
    setNovoNomeEditar(novoNome);
    editarInputRef.current.value = null; // limpa seleção anterior
    editarInputRef.current.click();
  }

  // Handler de mudança do input de edição
  async function handleEditarInput(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const formData = new FormData();
    formData.append("Nome", novoNomeEditar);
    formData.append("Arquivo", arquivo);

    try {
      await api.put(`Imagem/${editarId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Edição realizada com sucesso! 😁✨");
      listarCards();
      setEditarId(null);
      setNovoNomeEditar("");
    } catch (error) {
      console.error(error);
      alert("Não foi possível editar o card!");
    }
  }

  // Excluir card
  async function excluirCard(id) {
    try {
      await api.delete(`Imagem/${id}`);
      alert("Card excluído com sucesso!");
      listarCards();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o card!");
    }
  }

  useEffect(() => {
    listarCards();
  }, []);

  return (
    <>
      <h1 className='tituloGaleria'>Galeria Online</h1>

      <form className='formulario' onSubmit={cadastrarCard}>
        <div className='campoNome'>
          <label>Nome</label>
          <input
            type="text"
            className='inputNome'
            value={nomeImagem}
            onChange={(e) => setNomeImagem(e.target.value)}
          />
        </div>
        <div className='campoImagem'>
          <label className='arquivoLabel'>
            <i><img src={icon} alt="Ícone de upload de imagem" /></i>
            <input
              type="file"
              className="arquivoInput"
              onChange={(e) => setImagem(e.target.files[0])}
            />
          </label>
        </div>
        <Botao nomeBotao="Cadastrar" />
      </form>

      {/* Input oculto para edição de imagem */}
      <input
        type="file"
        ref={editarInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleEditarInput}
      />

      <div className='campoCards'>
        {cards.length > 0 ? (
          cards.map((e) => (
            <Card
              key={e.id}
              tituloCard={e.nome}
              imgCard={`https://localhost:7019/${e.caminho.replace("wwwroot/", "")}`}
              funcaoEditar={() => editarCard(e.id, e.nome)}
              funcaoExcluir={() => excluirCard(e.id)}
            />
          ))
        ) : (
          <p>Nenhum Card cadastrado</p>
        )}
      </div>
    </>
  );
};
