import "./Card.css"
import imgCard from "../../assets/img/ponyo.jpg"
import imgPen from '../../assets/img/pen.svg'
import imgTrash  from '../../assets/img/trash.svg'

export const Card = ({tituloCard}) => {
    return (
        <>
            <div className="cardDaImagem">
                <p>{tituloCard}</p>
                <img className="imgDoCard" src={imgCard} alt="imagem relacionada ao card" />

            <div className="icons">
                <img src={imgPen} alt="icone de uma caneta para realizar ua alteracao" />
                <img src={imgTrash} alt="icone de uma lixeira para realizar a exclusao" />
            </div>
            
            </div>
        </>
    )
}