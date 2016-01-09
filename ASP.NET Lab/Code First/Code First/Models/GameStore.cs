namespace Code_First
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class GameStore : DbContext
    {
        public GameStore()
            : base("name=GameStore")
        {
        }

        public virtual DbSet<C__MigrationHistory> C__MigrationHistory { get; set; }
        public virtual DbSet<Game> Game { get; set; }
        public virtual DbSet<Publisher> Publisher { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Game>()
                .Property(e => e.Name)
                .IsUnicode(false);

            modelBuilder.Entity<Publisher>()
                .Property(e => e.Name)
                .IsUnicode(false);

            modelBuilder.Entity<Publisher>()
                .HasMany(e => e.Game)
                .WithRequired(e => e.Publisher)
                .WillCascadeOnDelete(false);
        }
    }
}
