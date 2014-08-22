
/*
 * GET ontologies listing.
 */

lookup = function(repository, id) {
    var ol = repository.ontologies.filter(function(x){return x.id == id});    
    if (ol.length != 1) {
        console.warn("Lookup: "+id+" failed, num="+ol.length);
    }
    var ontology = ol[0];
    if (ontology != null) {
        addTags(ontology);
    }

    return ol[0];
}

addTags = function(ontology) {
    if (ontology == null) {
        return;
    }

    // TODO - do this in js
    if (ontology.description != null) {
        if (ontology.description.length > 40) {
            ontology.description_short = ontology.description.substr(0,40) + "...";
        }
        else {
            ontology.description_short = ontology.description;
        }
    }
    if (ontology.publications != null) {
        ontology.publications.forEach(function(pub) {
            var m = pub.id.match(/pubmed.(\d+)/);
            if (m) {
                pub.citations_link = "http://www.ncbi.nlm.nih.gov/pubmed?linkname=pubmed_pubmed&from_uid=" + m[1];
            }
        });
    }
    else {
        ontology.publications = [];
    }
    if (ontology.products == null) {
        ontology.products = [
            {
                id: ontology.id + ".owl"
            }
        ]
    }
    ontology.prefix = ontology.id.toUpperCase();
    //console.log("TODO - set this else where. Prefix = "+ontology.prefix);

}

exports.list = function(req, res){
    var repository = req.repository;
    //console.log(req);

    var ontologies = [];
    for (var k in repository.ontologies) {
        var ont = repository.ontologies[k];
        // TODO - do this separately
        addTags(ont);
        ontologies.push(ont);
        for (var j in ont.products) {
            var subont = ont.products[j];
            // TODO: decide on criterion - for now if the ontology has a contact
            // elevate this to sub-ontology
            if (subont.contact) {
                console.log("SUBONT: "+subont.id);
                ontologies.push(subont);
                subont.is_nested = true;
            }
        }
    }

    res.render('ontologies', { repository: repository,
                               ontologies: ontologies });
};

exports.info = function(req, res){
    var repository = req.repository;
    var id = req.params.id;
    //var ontology = repository.ontologies.filter(function(x){return x.id == id})[0];
    var ontology = lookup(repository, id);
    var dependencies = ontology.dependencies == null ? [] : ontology.dependencies;
    dependencies = dependencies.map(function(x){return lookup(repository, x.id)});
    dependencies = dependencies.filter(function(x) { return x != null});
    res.render('ontology_info', 
               { ont: ontology,
                 dependencies: dependencies
               });
};

exports.fall_through = function(req, res) {
    var repository = req.repository;
    var path = req.path.replace("/obo/","");
    console.log("OBO: "+path);
    var idmatch = path.match(/^(\S+)_(\S+)$/);
    var url;
    if (idmatch) {
        console.log("Looks like an ID/fragment: "+idmatch);
        var prefix = idmatch[1];
        var fragment = idmatch[2];
        url = "http://www.ontobee.org/browser/rdf.php?o="+prefix+"&iri=http://purl.obolibrary.org/obo/" + path;
    }
    else {
        var match = path.match(/^([\w\-]+)\/(.*)/);
        var prefix = match[1];
        var rest = match[2];
        var ontid = prefix.toLowerCase();
        var ont = lookup(repository, ontid);
        if (ont == null) {
            res.send(500);
        }
        if (ont.redirects) {
            for (var k in ont.redirects) {
                var x = ont.redirects[k];
                if (rest.match(x.match)) {
                    url = rest.replace(x.match, x.url);
                    console.log("REDIRECTING "+path+" ==> "+url);
                    break;
                }
            }
        }
    }

    if (url) {
        res.redirect(url);
    }
    else {
        res.send("DUNNO WHAT TO DO WITH "+path);
    }
    
};
