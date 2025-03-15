using Microsoft.EntityFrameworkCore;
using Server.Models.Entities;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
           : base(options)
        {
        }

        // DbSet-и для кожної сутності
        public DbSet<PdfFile> PDFFiles { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // За потреби можна додати додаткову конфігурацію
            // Наприклад, визначити індекси або обмеження для полів
        }
    }
}
