import './Botao.css'

export const Botao = ({nomeBotao, onClick}) => {
    return(
        <button className="botao" type="submit" onClick={onClick}>{nomeBotao}</button>
    )
}