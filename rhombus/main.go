package main

import (
	"github.com/EnoRage/rhombus-exchange-rates/server"
)

func main() {
	// @title Swagger Exchange API
	// @version 1.0
	// @description This is Rhombus Exchnage rates API

	// @contact.name API Support
	// @contact.email enormousrage@gmail.com

	// @license.name MIT
	// @license.url https://opensource.org/licenses/MIT

	// @host ethergram.tk:8080
	// @BasePath /
	server.RunServer()
}