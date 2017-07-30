/* global _ */

/**
 * A heritable allele, passed from parent to child, that determines observable attributes of the 
 * individual (i.e. the individual's phenotype).
 * @constructor
 * @param {string} locus This gene's locus. This functions as the gene's "id". If an organism has 
 *     multiple genes for the same locus, then the most dominent one(s) is/are the ones that will 
 *     be expressed.
 * @param {string} variant The variant of the gene expressed by this allele. For example, is this 
 *     the gene for blue eyes or brown ones? For orange fur or black fur?
 * @param {number} dominance How dominant this allele is over other variants. Lower numbers 
 *     represent higher dominance. For example, if an individual has two alleles for the same 
 *     gene, and one has dominance=1 and the other has dominance=2, then the one with dominance=1 
 *     gets expressed. Expressions can be co-dominant, such as the genes for orange fur and for 
 *     black fur in female domestic cats.
 */
var Gene = function(locus, variant, dominance) {
  let self = this;
  
  self.locus = locus;
  self.variant = variant;
  self.dominance = dominance;
};


/**
 * Class-static method that determines which gene variants will get expressed. You may pass in 
 * Gene objects of different loci.
 * @param {array} genes An array of Gene objects.
 * @returns {Object} A dictionary of arrays of "variant" values. The keys of this dictionary 
 *     correspond to the loci of the Gene objects passed. The elements of the array are the 
 *     sorted values of the "variant" members of the highest-dominant genes for each locus.
 *     This is implemented as an array in order to permit co-dominance.
 */
Gene.getExpressions = function(genes) {
  let variants = {};
  let dominances = {};
  
  genes.forEach(function(gene) {
    if (!(gene.locus in dominances) ||
        gene.dominance < dominances[gene.locus]) 
    {
      // Either this is the first gene we've encountered for this locus,
      // or this gene is the most dominant one we've found so far at this locus.
      // (Remember, lower dominance values represent *more* dominant genes.)
      dominances[gene.locus] = gene.dominance;
      variants[gene.locus] = [gene.variant];
    }
    else if (gene.dominance === dominances[gene.locus] &&
        !(variants[gene.locus].includes(gene.variant))) {
      // We've encountered a co-dominant variant that isn't
      // already in the set of returned variants for this locus.
      variants[gene.locus].push(gene.variant);
    }
  });
  
  return variants;
};

