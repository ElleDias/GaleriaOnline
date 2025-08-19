using GaleriaOnline.WebApi.DbContextImagem;
using GaleriaOnline.WebApi.Interface;
using GaleriaOnline.WebApi.Model;
using Microsoft.EntityFrameworkCore;

namespace GaleriaOnline.WebApi.Repositories
{
    public class ImagemRepository : IImagemRepository
    {
        private readonly GaleriaOnlineDbContext _context;

        public ImagemRepository(GaleriaOnlineDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Imagem>> GetAllAsync()
        {
            //isso faz listar todas as nossas imagens
           return await _context.Imagens.ToListAsync();
        }

        public async Task<Imagem> CreateAsync(Imagem imagem)
        {
            _context.Imagens.Add(imagem);
            await _context.SaveChangesAsync();
            return imagem;
        }

        public async Task<Imagem> DeleteAsync(int id)
        {
            var imagem = await _context.Imagens.SingleOrDefaultAsync(i => i.Id == id);
            if (imagem == null)
            {
                return null!;
            }

            _context.Imagens.Remove(imagem);
            await _context.SaveChangesAsync();
            return imagem;
        }



        public async Task<Imagem> GetByIdAsync(int id)
        {
            return await _context.Imagens.FindAsync(id);
        }

        public async Task<Imagem> UpdateAsync(Imagem imagem)
        {
            _context.Imagens.Update(imagem);
            await _context.SaveChangesAsync();
            return imagem;
        }

    }
}
