using Yeabuddy.Domain;

namespace Yeabuddy.Application;

public interface IWorkoutsService
{
    IEnumerable<Workout> List();
    Workout Create(Workout workout);
    Workout? Get(Guid id);
}

public class WorkoutsService : IWorkoutsService
{
    // In-memory store for initial prototype
    private readonly List<Workout> _workouts = new();

    public IEnumerable<Workout> List() => _workouts.OrderByDescending(w => w.Date);

    public Workout Create(Workout workout)
    {
        workout.Id = Guid.NewGuid();
        if (workout.Date == default)
        {
            workout.Date = DateTime.UtcNow;
        }
        _workouts.Add(workout);
        return workout;
    }

    public Workout? Get(Guid id) => _workouts.FirstOrDefault(w => w.Id == id);
}
