data/repository.ttl: data/repository.jsonld
	riot $< > $@.tmp && mv $@.tmp $@
