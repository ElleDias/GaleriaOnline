import './Home.css'
import { Botao } from '../../components/botao/Botao'

export const Home = () => {
    return (
        <>
            <div className="container">
                <h2>Bem-vindo a</h2>
                <h1>Galeria Online</h1>
            <div className='botaoContainer'>
                <Botao className="botaoContainer" nomeBotao="Entrar" />
            </div>
            </div>

        </>
    )
}