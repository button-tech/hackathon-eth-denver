package config

import (
	"log"

	"github.com/caarlos0/env"
)

type Config struct {
	ContractAddress  string `env:"CONTRACT_ADDRESS " envDefault:"default"`
}

var (
	ConfigInstance *Config
)

// ReturnConfig return config instance.
func ReturnConfig() *Config {
	if ConfigInstance == nil {
		ConfigInstance = &Config{}
		err := env.Parse(ConfigInstance)
		if err != nil {
			log.Fatalf("error initializing config: %s", err)
		}
	}
	return ConfigInstance
}