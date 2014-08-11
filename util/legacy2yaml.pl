#!/usr/bin/perl
use strict;
use MD5;
use YAML::Syck; $YAML::Syck::ImplicitTyping = 1;

my %skip = 
    (
     uberon =>1,
     cl =>1, 
     go => 1,
     ro => 1,
     ncbitaxon => 1,
     ncithesaurus => 1,
     molecular_function =>1,
     biological_process =>1,
     cellular_component =>1,
    );

my %h=();
my %ont;
my $id = '';
my $f = shift @ARGV;
open(F,$f) || die;
while(<F>) {
    chomp;
    if (m@^\s*$@) {
        $ont{$id} = {};
        foreach (keys %h) {
            $ont{$id}->{$_} = $h{$_};
        }
        %h = ();
    }
    elsif (m@^(\S+)\t(.*)@) {
        my ($k,$v) = ($1,$2);
        if ($k eq 'namespace') {
            $id = lc($v);
        }
        $h{$k} = $v;
    }
}
close(F);

# trackers
while (<>) {
    chomp;
    if (m@^\s*$@) {
        $id = undef;
    }
    if (m@^ontology_idspace:\s+(\S+)@) {
        $id = lc($1);
    }
    if (m@^url:\s+(\S+)@) {
        my $t = $1;
        if ($ont{$id}->{tracker} && $ont{$id}->{tracker} != $t) {
            warn("Conlict: $id $t");
        }
        $ont{$id}->{tracker} = $t;
    }
}

my $yaml = 
{ontologies => []};

my $oy;
foreach $id (keys %ont) {
    if ($skip{$id}) {
        next;
    }
    if ($id =~ /_/) {
        warn "SKIPPING ID WITH UNDERSCORE: $id";
        next;
    }

    $oy = {};
    my $h = $ont{$id};

    if ($h->{is_obsolete}) {
        next;
    }

    kv(id=>$id);
    kv(products=>[{id => "$id.owl"}]);
    kv(title=>$h->{title});
    kv(description=>$h->{description});
    kv(homepage=>$h->{home});
    kv(tracker=>$h->{tracker});
    kv(domain=>$h->{domain});
    kv(page=>$h->{documentation});
    if ($h->{contact} =~ /(.*)\t(\S+)\t(\S+)/) {
        kv(contact=>{email => "$2\@$3",
                     label=> $1});
    }
    if ($h->{relevant_organism} =~ /(NCBITaxon:\d+)\|(.*)/) {
        kv(taxon=>{id => $1, label => $2});
    }
    push(@{$yaml->{ontologies}}, $oy);
}
print Dump($yaml);
exit 0;

sub kv {
    my ($k, $v) = @_;
    if (!$v) {
        return;
    }
    if (0 && ref($v) eq 'HASH') {
        $v = "\n".join("\n",
                  (map {
                      "     $_: $v->{$_}"
                   } keys %$v));
    }
    if ($v =~ /\|(.*)/) {
        $v = $1;
    }
    $oy->{$k} = $v;
    #print "   $k: $v\n";
}
