
/*
 * GET ontologies listing.
 */

lookup = function(repository, id) {
    var ol = repository.ontologies.filter(function(x){return x.id == id});    
    if (ol.length != 1) {
        console.warn("Lookup: "+id+" failed, num="+ol.length);
    }
    return ol[0];
}

exports.list = function(req, res){
    var repository = req.repository;
    //console.log(req);
    console.log(JSON.stringify(repository,null, ' '));
    console.log("foo="+req.foo);
    console.log(JSON.stringify(req.repository));
    res.render('ontologies', { repository: repository,
                               ontologies: repository.ontologies });
};

exports.info = function(req, res){
    var repository = req.repository;
    var id = req.params.id;
    //var ontology = repository.ontologies.filter(function(x){return x.id == id})[0];
    var ontology = lookup(repository, id);
    var dependencies = ontology.dependencies.map(function(x){return lookup(repository, x.id)});
    dependencies = dependencies.filter(function(x) { return x != null});
    res.render('ontology_info', 
               { ont: ontology,
                 dependencies: dependencies
               });
};
