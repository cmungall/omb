data/repository.ttl: data/repository.jsonld
	riot $< > $@.tmp && mv $@.tmp $@

data/legacy.yaml: metadata/ontologies.txt metadata/trackers.txt
	./util/legacy2yaml.pl $^ > $@



heroku-create:
	heroku create --stack cedar
heroku-deploy:
	git push heroku master
##	git push monarch-heroku master

