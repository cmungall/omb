## Synopsis

An experimental ontology metadata browser

## About

This is a browser for a registry of ontologies and ontology-like
artefacts. It is partially designed to replace the ancient OBO Library
interface on http://obofoundry.org - but should also be somewhat
generic

## Improvements over old page

 * doesn't suck
 * correctly models distinction between an ontology and the subsets/artefacts it produces
 * supports various other metadata tags, including twitter feeds, publications, ...
 * social - integration with twitter

## Repository metadata

The repository is stored in YAML. Technically "YAML-LD" (it includes a
JSON-LD @context. Only the subset of YAML that is supported by JSON is
used. This means it is formally a JSON-LD file. And also formally an
RDF file).

The application reads the YAML file. There is also a makefile provided
to "convert" the YAML-LD to RDF. This is an entirely generic
conversion, performed using JENA Riot.

## Metadata Datamodel

This is in flux, may change drastically. However, the aim is to
conform to void etc as much as possible.

The model is designed to support a distinction between ontologies in
the sense of an all-encompassing project (e.g. GO) and the different
editions of that ontology: e.g. subsets, supersets, bridge files.

## Installation

``
npm install
``

Then

``
node app.js
``

After that connect to locahost:3000




