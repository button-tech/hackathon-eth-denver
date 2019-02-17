package server

import (
	_ "github.com/EnoRage/rhombus-exchange-rates/docs"
	"github.com/EnoRage/rhombus-exchange-rates/ethereum"
	"github.com/EnoRage/rhombus-exchange-rates/responses"
	"github.com/gin-gonic/contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/gin-swagger"
	"github.com/swaggo/gin-swagger/swaggerFiles"
	"net/http"
)

type ServerInstance struct {
	Engine *gin.Engine
}

func RunServer() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	s := ServerInstance{
		Engine: r,
	}
	r.Use(gin.Recovery())
	r.Use(cors.Default())
	r.GET("/rate/:currency", s.GetCurrencyToUSD)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Run(":8080")

}

// @Summary Return exchange rate of specific currency group
// @Description  Return exchange rate of specific currency group
// @Accept  text/plain
// @Produce  application/json
// @Param   currency     path    string     true        "currency"
// @Success 200 {array} responses.ExchangeResponse
// @Router /rate/{currency} [get]
//GetCurrencyToUSD Return exchange rate of specific currency group
func (s *ServerInstance) GetCurrencyToUSD(c *gin.Context) {
	r := responses.ExchangeResponse{}
	r.Rate = ethereum.GetRate(c.Param("currency"))
	c.JSON(http.StatusOK, r)
}
