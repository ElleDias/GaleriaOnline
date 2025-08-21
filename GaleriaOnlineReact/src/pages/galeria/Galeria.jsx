import './Galeria.css'
import icon from "./../../assets/img/upload.svg"
import { Botao } from '../../components/botao/Botao'
import {Card} from '../../components/card/Card'


export const Galeria = () => {
    return (
        <>
            <h1 className="tituloGaleria">Galeria Online</h1>

            <form className="formulario" action="">
                <div className="campoNome">
                    <label htmlFor="">Nome</label>
                    <input type="text" className='inputNome' required />
                </div>
                <div className="campoImagem">
                    <label className='arquivoLabel' htmlFor="">
                        <i>
                            <img src={icon} alt='Icone de upload de imagem' />
                        </i>
                        <input type='file' className='arquivoInput' required />
                    </label>
                </div>
                <Botao nomeBotao="Cadastrar" />
            </form>
            <div className='campoCards' >
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                <Card tituloCard="studio ghibli"/>
                
            </div>
        </>
    )
}
