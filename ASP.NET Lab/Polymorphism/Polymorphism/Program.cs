using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Polymorphism
{
    class Program
    {
        static void Main(string[] args)
        {
            var players = new List<Player>();
            var gmplayer = new GameMaster();
            var nplayer = new Player();

            gmplayer.Id = 1;
            gmplayer.Name = "Max";
            gmplayer.Privilege = "All";

            nplayer.Id = 2;
            nplayer.Name = "John";

            players.Add(nplayer);
            players.Add(gmplayer);

            foreach (var player in players)
            {
                Console.WriteLine(player.GetInfo());
            }

            Console.WriteLine("Press any key...");
            Console.ReadKey();
        }
    }
}
