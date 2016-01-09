namespace Movie_Store.Migrations
{
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Movie_Store.Models.MovieDBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Movie_Store.Models.MovieDBContext context)
        {
            context.Movies.AddOrUpdate(i => i.Title,
        new Movie
        {
            Title = "When Harry Met Sally",
            ReleaseDate = DateTime.Parse("2532-1-11"),
            Genre = "Romantic Comedy",
            Price = 7.99M,
            Rating = "PG",
        },

         new Movie
         {
             Title = "Ghostbusters ",
             ReleaseDate = DateTime.Parse("2527-3-13"),
             Genre = "Comedy",
             Price = 8.99M,
             Rating = "PG",
         },

         new Movie
         {
             Title = "Ghostbusters 2",
             ReleaseDate = DateTime.Parse("2529-2-23"),
             Genre = "Comedy",
             Price = 9.99M,
             Rating = "PG",
         },

       new Movie
       {
           Title = "Rio Bravo",
           ReleaseDate = DateTime.Parse("2502-4-15"),
           Genre = "Western",
           Price = 3.99M,
           Rating = "PG",
       }
   );
        }
    }
}
