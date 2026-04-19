.PHONY: help install dev build preview deploy deploy-preview link check lighthouse clean

help: ## Affiche l'aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dependances npm
	npm install

dev: ## Lance le serveur de developpement (http://localhost:4321)
	npm run dev

build: ## Build statique de production (dossier dist/)
	npm run build

preview: ## Preview local du build de production
	npm run preview

link: ## Lie le projet a un site Netlify (a faire une seule fois)
	netlify link

deploy: build ## Build puis deploiement production Netlify
	netlify deploy --prod --dir=dist

deploy-preview: build ## Build puis deploiement preview Netlify (URL unique)
	netlify deploy --dir=dist

check: ## Verifie les types et build
	npm run check
	npm run build

lighthouse: ## Audit Lighthouse sur le build local
	npm run build && npx lighthouse http://localhost:4321 --view

clean: ## Nettoie dist, node_modules/.astro et .netlify
	rm -rf dist node_modules/.astro .netlify
