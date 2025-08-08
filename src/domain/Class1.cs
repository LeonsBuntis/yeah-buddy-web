namespace Yeabuddy.Domain {
    public class Workout {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string? Name { get; set; }
        public IList<Exercise> Exercises { get; set; } = new List<Exercise>();
    }

    public class Exercise {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public IList<Set> Sets { get; set; } = new List<Set>();
    }

    public class Set {
        public Guid Id { get; set; } = Guid.NewGuid();
        public int Reps { get; set; }
        public decimal? Weight { get; set; }
        public int? Rpe { get; set; }
    }
}
