package main

import (
	// "fmt"

	"log"

	"github.com/gofiber/fiber/v2"
)

// define struct
type Todo struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	IsDone bool   `json:"done"`
	Body   string `json:"body"`
}

func main() {
	app := fiber.New()

	todos := []Todo{}

	// check endpoint
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to api todo with go")
	})

	// Enpoint add todo
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return c.Status(500).JSON(err)
		}

		todo.ID = len(todos) + 1
		todos = append(todos, *todo)
		return c.Status(201).JSON(&fiber.Map{
			"success": true,
			"message": "Data berhasil ditambah",
			"todo":    todo,
		})
	})

	// endpoint get todo
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(&fiber.Map{
			"success": true,
			"todos":   todos,
		})
	})

	// endpont patch todo
	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("invalid id")
		}

		for i, t := range todos {
			if t.ID == id {
				todos[i].IsDone = true
				break
			}
		}
		return c.Status(200).JSON(&fiber.Map{
			"success": true,
			"todos":   todos,
		})
	})

	log.Fatal(app.Listen(":8080"))

}
