namespace Yeabuddy.Domain {
    public enum ExerciseModality
    {
        WeightReps = 1,     // Traditional weight x reps
        Time = 2,           // Time-based (e.g., plank, cardio)
        Distance = 3,       // Distance-based (e.g., running, cycling)
        Bodyweight = 4,     // Bodyweight exercises
        Assisted = 5        // Assisted exercises (e.g., assisted pull-ups)
    }

    public class Workout {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string? Name { get; set; }
        public IList<Exercise> Exercises { get; set; } = new List<Exercise>();
    }

    public class Exercise {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public ExerciseModality Modality { get; set; } = ExerciseModality.WeightReps;
        public IList<Set> Sets { get; set; } = new List<Set>();
    }

    public class Set {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Core fields for all modalities
        public int Reps { get; set; }
        public decimal? Weight { get; set; }
        public int? Rpe { get; set; }
        
        // Time-based fields
        public long? DurationMs { get; set; }
        
        // Distance-based fields  
        public decimal? DistanceM { get; set; }
        
        // Flags
        public bool IsWarmup { get; set; } = false;
        public bool IsDropset { get; set; } = false;
        public bool IsFailure { get; set; } = false;
        public bool IsBodyweight { get; set; } = false;
        
        // Additional weight for bodyweight/assisted exercises
        public decimal? AdditionalWeight { get; set; }
        
        // Notes
        public string? Notes { get; set; }
        
        // Rest timer
        public int? RestSeconds { get; set; }
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
