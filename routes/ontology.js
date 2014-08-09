
/*
 * GET ontologies listing.
 */

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
    var ontology = repository.ontologies.filter(function(x){return x.id == id})[0];
    res.render('ontology_info', { ont: ontology });
};
