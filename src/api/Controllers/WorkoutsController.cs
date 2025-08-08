using Microsoft.AspNetCore.Mvc;
using Yeabuddy.Application;
using Yeabuddy.Domain;

namespace Yeabuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutsController(IWorkoutsService service) : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Workout>> List() => Ok(service.List());

    [HttpGet("{id}")]
    public ActionResult<Workout> Get(Guid id)
    {
        var workout = service.Get(id);
        return workout is null ? NotFound() : Ok(workout);
    }

    [HttpPost]
    public ActionResult<Workout> Create([FromBody] Workout workout)
    {
        var created = service.Create(workout);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }
}
