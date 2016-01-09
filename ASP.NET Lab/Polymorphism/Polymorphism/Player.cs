using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Polymorphism
{
    class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual string GetInfo()
        {
            return string.Format("{0}:{1}",Id,Name);
        }
    }

    class GameMaster : Player
    {
        public string Privilege { get; set; }
        public override string GetInfo()
        {
            return string.Format("{0}:{1} {2}", Id, Name , Privilege);
        }
    }
}
