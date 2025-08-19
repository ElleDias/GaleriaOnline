using GaleriaOnline.WebApi.DTO;
using GaleriaOnline.WebApi.Interface;
using GaleriaOnline.WebApi.Model;
using Microsoft.AspNetCore.Mvc;

namespace GaleriaOnline.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagemController : ControllerBase
    {
        private readonly IImagemRepository _repository;
        private readonly IWebHostEnvironment _env;

        public ImagemController(IImagemRepository repository, IWebHostEnvironment env)
        {
            _repository = repository;
            _env = env;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImagePorId(int id)
        {
            var imagem = await _repository.GetByIdAsync(id);
            if (imagem == null)
                return NotFound();
            return Ok(imagem);
        }

        [HttpGet]
        public async Task<IActionResult> GetTodasAsImagens()
        {
            var imagens = await _repository.GetAllAsync();
            return Ok(imagens);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImagem([FromForm] ImagemDTO dto)
        {
            if (dto.Arquivo == null || dto.Arquivo.Length == 0 || string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Poderia enviar um Nome e uma Imagem, por gentileza?");

            var extensao = Path.GetExtension(dto.Arquivo.FileName);
            var nomeArquivo = $"{Guid.NewGuid()}{extensao}";
            var pastaRelativa = "wwwroot/imagens";
            var caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), pastaRelativa);

            if (!Directory.Exists(caminhoPasta))
                Directory.CreateDirectory(caminhoPasta);

            var caminhoCompleto = Path.Combine(caminhoPasta, nomeArquivo);
            using var stream = new FileStream(caminhoCompleto, FileMode.Create);
            await dto.Arquivo.CopyToAsync(stream);

            var imagem = new Imagem
            {
                Nome = dto.Nome,
                Caminho = Path.Combine(pastaRelativa, nomeArquivo).Replace("\\", "/")
            };

            await _repository.CreateAsync(imagem);
            return CreatedAtAction(nameof(GetImagePorId), new { id = imagem.Id }, imagem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarImagem(int id, [FromForm] PutImagemDTO imagemAtualizada)
        {
            var imagem = await _repository.GetByIdAsync(id);
            if (imagem == null)
                return NotFound("Imagem não encontrada");

            if (imagemAtualizada.Arquivo == null && string.IsNullOrWhiteSpace(imagemAtualizada.Nome))
                return BadRequest("Pelo menos um dos campos tem que ser preenchido.");

            if (!string.IsNullOrWhiteSpace(imagemAtualizada.Nome))
                imagem.Nome = imagemAtualizada.Nome;

            var caminhoAntigo = Path.Combine(Directory.GetCurrentDirectory(), imagem.Caminho.Replace("/", Path.DirectorySeparatorChar.ToString()));

            if (imagemAtualizada.Arquivo != null && imagemAtualizada.Arquivo.Length > 0)
            {
                if (System.IO.File.Exists(caminhoAntigo))
                {
                    System.IO.File.Delete(caminhoAntigo);
                }

                var extensao = Path.GetExtension(imagemAtualizada.Arquivo.FileName);
                var nomeArquivo = $"{Guid.NewGuid()}{extensao}";
                var pastaRelativa = "wwwroot/imagens";
                var caminhoPasta = Path.Combine(Directory.GetCurrentDirectory(), pastaRelativa);

                if (!Directory.Exists(caminhoPasta))
                {
                    Directory.CreateDirectory(caminhoPasta);
                }

                var caminhoCompleto = Path.Combine(caminhoPasta, nomeArquivo);
                using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                {
                await imagemAtualizada.Arquivo.CopyToAsync(stream);

                }

                imagem.Caminho = Path.Combine(pastaRelativa, nomeArquivo).Replace("\\", "/");
            }

            var atualizado = await _repository.UpdateAsync(imagem);
            if (!atualizado)
                return StatusCode(500, "Ocorreu um erro ao atualizar a imagem.");

            return Ok(imagem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarImagem(int id)
        {
            var imagem = await _repository.GetByIdAsync(id);
            if (imagem == null)
                return NotFound("Imagem não encontrada");

            var caminhoFisico = Path.Combine(Directory.GetCurrentDirectory(), imagem.Caminho.Replace("/", Path.DirectorySeparatorChar.ToString()));

            try
            {
                if (System.IO.File.Exists(caminhoFisico))
                    System.IO.File.Delete(caminhoFisico);

                var deletado = await _repository.DeleteAsync(id);
                if (!deletado)
                    return StatusCode(500, "Erro ao excluir imagem do banco");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao excluir o arquivo: {ex.Message}");
            }
        }
    }
}
