data/repository.ttl: data/repository.json
	riot $< > $@.tmp && mv $@.tmp $@
