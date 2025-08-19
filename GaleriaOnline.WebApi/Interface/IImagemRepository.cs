using GaleriaOnline.WebApi.Model;

namespace GaleriaOnline.WebApi.Interface
{
    public interface IImagemRepository
    {
        Task<IEnumerable<Imagem>> GetAllAsync();
        Task<Imagem> GetByIdAsync(int id);
        Task<Imagem> CreateAsync(Imagem imagem);

        Task<Imagem> UpdateAsync(Imagem imagem);

        Task<Imagem> DeleteAsync(int id);
    }
}
