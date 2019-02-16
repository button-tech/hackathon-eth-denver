package server

import (
	"../ethereum"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type ServerInstance struct {
	Engine *gin.Engine
}

func RunServer()  {
	r := gin.New()
	s := ServerInstance{
		Engine: r,
	}
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.GET("/rate/:currency", s.GetCurrencyToUSD)

	r.Run(":8080")

}



func (s *ServerInstance) GetCurrencyToUSD(c *gin.Context) {
	log.Println(c.Param("currency"))
	c.JSON(http.StatusOK, gin.H{
		"rate":  (ethereum.GetRate(c.Param("currency"))),
	})
}
